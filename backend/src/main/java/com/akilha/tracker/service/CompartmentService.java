package com.akilha.tracker.service;

import com.akilha.device.entity.Device;
import com.akilha.device.exception.DeviceExceptions;
import com.akilha.device.repository.DeviceRepository;
import com.akilha.logging.entity.ActivityType;
import com.akilha.logging.service.ActivityLogService;
import com.akilha.tracker.dto.CompartmentCreateAndUpdateRequest;
import com.akilha.tracker.dto.CompartmentSummaryDto;
import com.akilha.tracker.dto.PillInstanceSummaryDto;
import com.akilha.tracker.entity.*;
import com.akilha.tracker.exception.TrackerExceptions;
import com.akilha.tracker.repository.CompartmentRepository;
import com.akilha.tracker.repository.MedicineBatchRepository;
import com.akilha.tracker.repository.MedicineRepository;
import com.akilha.tracker.repository.PillInstanceRepository;
import com.akilha.user.entity.User;
import com.akilha.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompartmentService {

    private final CompartmentRepository compartmentRepo;
    private final MedicineRepository medicineRepo;
    private final MedicineBatchRepository batchRepo;
    private final PillInstanceRepository instanceRepo;
    private final DeviceRepository deviceRepo;
    private final UserService userService;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    @Transactional
    public void create(CompartmentCreateAndUpdateRequest r) {
        // —————————————— 1. Manager Kullanıcısını Al ——————————————
        User manager = userService.getCurrentUser();

        // —————————————— 2. Cihazı Bul, Yoksa Hata Fırlat ——————————————
        Device device = deviceRepo.findById(r.getDeviceId())
                .orElseThrow(() -> new DeviceExceptions.DeviceNotFoundException());

        // —————————————— 3. Aynı IDX’te Var mı Kontrol Et ——————————————
        Compartment c = compartmentRepo
                .findByDevice_IdAndIdx(device.getId(), r.getIdx())
                .orElse(null);

        if (c != null) {
            // Mevcutsa, hâlâ bekleyen hap (PENDING) var mı kontrol et
            boolean hasPending = instanceRepo
                    .existsByBatch_CompartmentAndStatus(c, PillStatus.PENDING);

            if (hasPending) {
                throw new TrackerExceptions.CompartmentStillHasDispenseWaitingPillsException();
            }
        } else {
            // Yeni compartment oluştur ve kaydet
            c = new Compartment();
            c.setIdx(r.getIdx());
            c.setDevice(device);
            compartmentRepo.save(c);
        }

        // —————————————— 4. Yeni Medicine ve Batch/Instance’ları Kaydet ——————————————
        Medicine m = new Medicine();
        m.setName(r.getMedicine().getName());
        m.setDosage(r.getMedicine().getDosage());
        m.setOwner(manager);
        medicineRepo.save(m);

        applyMedicineBatchAndInstances(c, m, r.getScheduleList());

        // —————————————— 5. Log: Compartment Created ——————————————
        activityLogService.logCompartmentCreated(
                manager.getUsername(),
                device.getName(),
                device.getId(),
                r.getIdx(),
                m.getName()
        );

        // —————————————— 6. Bildirim Gönder ——————————————
        notificationService.sendCompartmentCreated(c);
    }

    @Transactional
    public void updateByCurrentUserAndIdx(CompartmentCreateAndUpdateRequest r)
            throws AccessDeniedException {

        // —————————————— 1. Şu anki Kullanıcıyı Al ——————————————
        User current = userService.getCurrentUser();
        if (current == null) {
            throw new TrackerExceptions.CurrentSessionUserNotFoundException();
        }

        // —————————————— 2. Bu Kullanıcının Sahip Olduğu Cihazı Bul ——————————————
        Device device = deviceRepo
                .findByOwner_Id(current.getId())
                .orElseThrow(() ->
                        new TrackerExceptions.DeviceNotFoundByOwnerException(current.getId())
                );

        // —————————————— 3. Compartment’ı İndex’e Göre Bul ——————————————
        int idx = r.getIdx();
        Compartment c = compartmentRepo
                .findByDevice_IdAndIdx(device.getId(), idx)
                .orElseThrow(() ->
                        new TrackerExceptions.CompartmentNotFoundException(device.getId(), idx)
                );

        // —————————————— 4. Erişim Kontrolü ——————————————
        if (!c.getDevice().getOwner().getId().equals(current.getId())) {
            throw new TrackerExceptions.CompartmentAccessDeniedException();
        }

        // —————————————— 5. Mevcut PENDING Statülü Instance’ları Temizle ——————————————
        instanceRepo.deleteByBatch_CompartmentAndStatus(c, PillStatus.PENDING);

        // —————————————— 6. Yeni Medicine Kaydet ——————————————
        Medicine m = new Medicine();
        m.setName(r.getMedicine().getName());
        m.setDosage(r.getMedicine().getDosage());
        m.setOwner(current);
        medicineRepo.save(m);

        // —————————————— 7. WebSocket Bildirimi (Compartment Updated) ——————————————
        notificationService.sendCompartmentUpdated(c);

        // —————————————— 8. Yeni Batch ve PillInstance’lar ——————————————
        applyMedicineBatchAndInstances(c, m, r.getScheduleList());

        // —————————————— 9. Log: Compartment Updated ——————————————
        // Detay olarak; deviceId, deviceName, idx, yeni medicineName bilgilerini koyduk.
        Map<String, Object> updateDetails = Map.of(
                "deviceId", device.getId(),
                "deviceName", device.getName(),
                "compartmentIdx", idx,
                "medicineName", m.getName(),
                "action", "compartment_updated"
        );
        activityLogService.logActivity(
                current.getUsername(),
                ActivityType.COMPARTMENT_UPDATED,
                String.format("'%s' cihazının %d. bölmesi güncellendi; yeni ilaç: %s",
                        device.getName(), idx, m.getName()),
                updateDetails,
                true
        );
    }

    /**
     * ✅ Cihaza ait tüm aktif compartment’ları (içinde PENDING/DISPENSED_WAITING/MISSED hap olanları)
     * derleyen özet DTO listesini döner. (Viewer veya Manager yetkisiyle.)
     */
    @Transactional
    public List<CompartmentSummaryDto> listFront(Long deviceId) throws AccessDeniedException {
        User viewerOrManager = userService.getCurrentUser();
        Device d = deviceRepo.findById(deviceId)
                .orElseThrow(() -> new DeviceExceptions.DeviceNotFoundException());

        if (!d.getOwner().equals(viewerOrManager) && !d.getViewers().contains(viewerOrManager)) {
            throw new TrackerExceptions.CompartmentAccessDeniedException();
        }

        List<Compartment> compartments = compartmentRepo.findByDevice_IdOrderByIdxAsc(deviceId);

        return compartments.stream()
                .map(compartment -> {
                    Optional<MedicineBatch> latestBatchOpt =
                            batchRepo.findTopByCompartmentOrderByLoadedAtDesc(compartment);

                    if (!latestBatchOpt.isPresent()) {
                        return Optional.<CompartmentSummaryDto>empty();
                    }

                    MedicineBatch latestBatch = latestBatchOpt.get();
                    boolean isActive = latestBatch.getInstances().stream().anyMatch(instance ->
                            instance.getStatus() == PillStatus.PENDING ||
                                    instance.getStatus() == PillStatus.DISPENSED_WAITING ||
                                    instance.getStatus() == PillStatus.MISSED
                    );

                    if (isActive) {
                        List<PillInstanceSummaryDto> summaryList = latestBatch.getInstances().stream()
                                .map(instance -> new PillInstanceSummaryDto(
                                        instance.getScheduledAt(),
                                        instance.getStatus(),
                                        instance.getConsumedAt()
                                ))
                                .collect(Collectors.toList());

                        CompartmentSummaryDto dto = CompartmentSummaryDto.builder()
                                .compartmentId(compartment.getId())
                                .idx(compartment.getIdx())
                                .medicineName(latestBatch.getMedicine().getName())
                                .medicineDosage(latestBatch.getMedicine().getDosage())
                                .currentStock(latestBatch.getQuantity())
                                .scheduleSummary(summaryList)
                                .build();

                        return Optional.of(dto);
                    } else {
                        return Optional.<CompartmentSummaryDto>empty();
                    }
                })
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteByDeviceAndIdx(Long deviceId, int idx) throws AccessDeniedException {
        // —————————————— 1. Compartment’ı Bul ——————————————
        Compartment c = compartmentRepo
                .findByDevice_IdAndIdx(deviceId, idx)
                .orElseThrow(() -> new TrackerExceptions.CompartmentNotFoundException(deviceId, idx));

        // —————————————— 2. Yalnızca Sahip Silebilir ——————————————
        User currentUser = userService.getCurrentUser();
        if (!c.getDevice().getOwner().getId().equals(currentUser.getId())) {
            throw new TrackerExceptions.CompartmentAccessDeniedException();
        }

        // —————————————— 3. PENDING Statülü İlaçları Manuel Sil ve Batch’leri Güncelle ——————————————
        List<PillInstance> pendingInstances = instanceRepo
                .findByBatch_CompartmentAndStatus(c, PillStatus.PENDING);

        if (!pendingInstances.isEmpty()) {
            instanceRepo.deleteAll(pendingInstances);

            Map<MedicineBatch, Long> countByBatch = pendingInstances.stream()
                    .collect(Collectors.groupingBy(PillInstance::getBatch, Collectors.counting()));

            countByBatch.forEach((batch, cnt) -> {
                batch.setQuantity(batch.getQuantity() - cnt.intValue());
                batchRepo.save(batch);
            });
        }

        // —————————————— 4. PENDING Olmayanları Detach Et ——————————————
        List<PillInstance> nonPendingInstances = instanceRepo
                .findByBatch_CompartmentAndStatusNot(c, PillStatus.PENDING);

        if (!nonPendingInstances.isEmpty()) {
            boolean hasDispenseWaiting = nonPendingInstances.stream()
                    .anyMatch(inst -> inst.getStatus() == PillStatus.DISPENSED_WAITING);

            if (hasDispenseWaiting) {
                throw new TrackerExceptions.CompartmentStillHasDispenseWaitingPillsException();
            }

            for (PillInstance inst : nonPendingInstances) {
                MedicineBatch parentBatch = inst.getBatch();
                inst.setBatch(null);
                instanceRepo.save(inst);

                if (parentBatch != null) {
                    parentBatch.getInstances().remove(inst);
                }
            }
        }

        // —————————————— 5. Boş Kalan Batch’leri Sil ——————————————
        List<MedicineBatch> batchesOfCompartment = batchRepo.findByCompartment(c);
        for (MedicineBatch batch : batchesOfCompartment) {
            boolean noInstancesLeft = batch.getInstances().isEmpty();
            boolean noStockLeft     = batch.getQuantity() <= 0;

            if (noInstancesLeft && noStockLeft) {
                batchRepo.delete(batch);
            }
        }

        // —————————————— 6. Compartment’ı Kendisi Sil ——————————————
        compartmentRepo.delete(c);

        // —————————————— 7. Log: Compartment Deleted ——————————————
        // Detay olarak deviceId, deviceName, idx bilgilerini koyduk.
        Device device = c.getDevice();
        Map<String, Object> deleteDetails = Map.of(
                "deviceId", device.getId(),
                "deviceName", device.getName(),
                "compartmentIdx", idx,
                "action", "compartment_deleted"
        );
        activityLogService.logActivity(
                currentUser.getUsername(),
                ActivityType.COMPARTMENT_DELETED,
                String.format("'%s' cihazının %d. bölmesi silindi", device.getName(), idx),
                deleteDetails,
                true
        );

        // —————————————— 8. Bildirim (isteğe bağlı) ——————————————
        notificationService.sendCompartmentDeleted(c);
    }


    private void applyMedicineBatchAndInstances(Compartment c,
                                                Medicine medicine,
                                                List<LocalDateTime> times) {
        int quantity = times.size();
        MedicineBatch batch = new MedicineBatch(medicine, c, quantity);
        batchRepo.save(batch);

        c.getBatches().add(batch);
        for (LocalDateTime localTime : times) {

            LocalDateTime correctedTime = localTime.plusHours(3);

            if (correctedTime.isAfter(LocalDateTime.now())) {
                instanceRepo.save(new PillInstance(batch, correctedTime));
            }
        }
    }


}