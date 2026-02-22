package com.akilha.tracker.service;

import com.akilha.device.entity.Device;
import com.akilha.device.repository.DeviceRepository;
import com.akilha.logging.service.ActivityLogService;
import com.akilha.tracker.dto.PillDropRequest;
import com.akilha.tracker.dto.PillNotTakenRequest;
import com.akilha.tracker.entity.*;
import com.akilha.tracker.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PillDropService {

    private final DeviceRepository            deviceRepo;
    private final PillInstanceRepository      instanceRepo;
    private final CompartmentRepository       compartmentRepo;
    private final DroppedPillTrayRepository   trayRepo;
    private final MedicineBatchRepository     batchRepo;
    private final NotificationService         notificationService;
    private final ActivityLogService          activityLogService;  // <<< Log servisini ekledik

    @Transactional
    public void confirmDrop(Long deviceId, PillDropRequest req) {
        // —————————————— 1. Cihaza Ait Kayıt varsa çek, yoksa hata fırlat ——————————————
        Device device = deviceRepo.findById(deviceId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cihaz bulunamadı"));

        // —————————————— 2. Gelen compartmentIdx ile çekmeceyi al, tutarsızsa hata ——————————————
        Compartment comp = compartmentRepo.findByDevice_IdAndIdx(deviceId, req.getCompartmentIdx())
                .orElseThrow(() -> new IllegalArgumentException("Cihaz ve idx uyuşmuyor"));

        if (!comp.getDevice().equals(device)) {
            throw new IllegalStateException("Cihaz–çekmece uyuşmazlığı");
        }

        // —————————————— 3. PillInstance’ı ID’den çek, yoksa hata ——————————————
        PillInstance instance = instanceRepo.findById(req.getPillInstanceId())
                .orElseThrow(() ->
                        new IllegalArgumentException("PillInstance bulunamadı"));

        if (instance.getStatus() != PillStatus.PENDING) {
            throw new IllegalStateException("Sadece PENDING haplar düşürülebilir");
        }

        // —————————————— 4. Durumu DISPENSED_WAITING olarak güncelle ve tarihler kaydet ——————————————
        LocalDateTime now = LocalDateTime.now();
        instance.setStatus(PillStatus.DISPENSED_WAITING);
        instance.setDispensedAt(now);
        instanceRepo.save(instance);

        // —————————————— 5. DroppedPillTray kaydı oluştur ——————————————
        trayRepo.save(new DroppedPillTray(instance, now));

        // —————————————— 6. İlgili MedicineBatch’in quantity değerini azalt ve kaydet ——————————————
        MedicineBatch batch = instance.getBatch();
        batch.decrementQuantity();
        batchRepo.save(batch);

        // —————————————— 7. Log: Pill Dropped ——————————————
        //    Parametreler: deviceName, deviceId, compartmentIdx, medicineName, pillInstanceId
        String deviceName   = device.getName();
        Integer compartmentIdx = comp.getIdx();
        String medicineName = batch.getMedicine().getName();
        Long pillInstanceId = instance.getId();

        activityLogService.logPillDropped(
                deviceName,
                deviceId,
                compartmentIdx,
                medicineName,
                pillInstanceId
        );

        // —————————————— 8. Bildirim Gönder ——————————————
        notificationService.sendPillDropped(instance);
    }

    @Transactional
    public void confirmTrayEmptied(Long deviceId) {
        // Bu metod, trayRepo’daki tüm DroppedPillTray kayıtlarını dolaşıp
        // her bir tray için ilgili PillInstance’ın durumunu “TAKEN_ON_TIME” veya “TAKEN_LATE” olarak günceller.
        // Ardından tray kaydını siler.

        List<DroppedPillTray> trays =
                trayRepo.findByPillInstance_Batch_Compartment_Device_Id(deviceId);

        if (trays.isEmpty()) {
            trays = trayRepo.findAll();
        }

        for (DroppedPillTray tray : trays) {
            PillInstance inst = tray.getPillInstance();

            if (inst.getStatus() == PillStatus.DISPENSED_WAITING
                    || inst.getStatus() == PillStatus.MISSED) {

                LocalDateTime now = LocalDateTime.now();

                // Eğer hâlâ consumedAt boşsa, şimdi set et
                if (inst.getConsumedAt() == null) {
                    inst.setConsumedAt(now);
                }


                boolean onTime = inst.getStatus() == PillStatus.DISPENSED_WAITING
                        && inst.getDispensedAt() != null
                        && now.isBefore(inst.getDispensedAt().plusMinutes(10));

                inst.setStatus(onTime ? PillStatus.TAKEN_ON_TIME : PillStatus.TAKEN_LATE);
                instanceRepo.save(inst);

                // —————————————— Log: Pill Taken ——————————————
                //    Burada “username” bilgisi doğrudan bilinmediği için “SYSTEM” kullanıyoruz.
                //    Parametreler: username, deviceName, deviceId, compartmentIdx, medicineName, pillInstanceId
                String deviceName   = inst.getBatch().getCompartment().getDevice().getName();
                Integer compartmentIdx = inst.getBatch().getCompartment().getIdx();
                String medicineName = inst.getBatch().getMedicine().getName();
                Long pillInstanceId = inst.getId();

                activityLogService.logPillTaken(
                        "SYSTEM",
                        deviceName,
                        deviceId,
                        compartmentIdx,
                        medicineName,
                        pillInstanceId
                );

                // —————————————— Bildirim Gönder: Pill Taken ——————————————
                notificationService.sendPillTaken(inst);
            }

            // Tray satırını sil
            trayRepo.delete(tray);
        }
    }
    @Transactional
    public void confirmNotTaken(Long deviceId, PillNotTakenRequest req) {

        // 1) İlgili instance’ı çek
        PillInstance inst = instanceRepo.findById(req.getPillInstanceId())
                .orElseThrow(() -> new IllegalArgumentException("PillInstance bulunamadı"));

        // Yalnızca hâlâ DISPENSED_WAITING durumundaysa devam et
        if (inst.getStatus() != PillStatus.DISPENSED_WAITING&&inst.getStatus() != PillStatus.MISSED) {
            return;
        }

        // 2) Statüyü MISSED yap
        inst.setStatus(PillStatus.MISSED);
        instanceRepo.save(inst);

        // 3) Anında log (istenirse try-catch ile sessiz)
        activityLogService.logPillNotTaken(
                inst.getBatch().getCompartment().getDevice().getName(),
                deviceId,
                inst.getBatch().getCompartment().getIdx(),
                inst.getBatch().getMedicine().getName(),
                inst.getId()
        );

        notificationService.sendPillMissed(inst);

    }
}