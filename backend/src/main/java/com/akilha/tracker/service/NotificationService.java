package com.akilha.tracker.service;

import com.akilha.device.entity.Device;
import com.akilha.logging.service.ActivityLogService;
import com.akilha.tracker.dto.CompartmentNotificationDto;
import com.akilha.tracker.dto.PillNotificationDto;
import com.akilha.tracker.entity.Compartment;
import com.akilha.tracker.entity.Medicine;
import com.akilha.tracker.entity.PillInstance;
import com.akilha.tracker.entity.PillStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.scheduling.annotation.Async;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate broker;
    private final ActivityLogService activityLogService;

    @Value("${pi.sync.url}")
    private String piSyncUrl;

    /**
     * Sahibine ve tüm viewer'lara aynı bildirimi gönderir.
     * @param device       Hangi cihazın sahibine/viewer'larına gidecek
     * @param topicSuffix  topic'in sonuna eklenecek ("/compartment" veya "")
     * @param dto          Gönderilecek payload
     */
    private void broadcastToAll(Device device, String topicSuffix, Object dto) {
        // 1) Cihaz sahibi
        String ownerTopic = "/topic/device/" + device.getOwner().getId() + topicSuffix;
        broker.convertAndSend(ownerTopic, dto);


        device.getViewers().forEach(viewer -> {
            String viewerTopic = "/topic/device/" + viewer.getId() + topicSuffix;
            broker.convertAndSend(viewerTopic, dto);
        });
    }

    // ════════════ ÇEKMECE OLAYLARI ════════════

    public void sendCompartmentCreated(Compartment c) {
        CompartmentNotificationDto dto = buildCompartmentDto(c, "CREATED");
        notifyPiForSyncAfterCommit(c.getDevice());
        try {
            broadcastToAll(c.getDevice(), "/compartment", dto);

            Device device = c.getDevice();
            String ownerUsername = device.getOwner().getUsername();
            Medicine medicine = c.getBatches().isEmpty() ? null : c.getBatches().get(0).getMedicine();
            String medicineName = medicine != null ? medicine.getName() : "Bilinmeyen İlaç";
            activityLogService.logCompartmentCreationNotification(
                    ownerUsername,
                    device.getName(),
                    medicineName,
                    true
            );
        } catch (Exception e) {
            // Log başarısız
            Device device = c.getDevice();
            String ownerUsername = device.getOwner().getUsername();
            Medicine medicine = c.getBatches().isEmpty() ? null : c.getBatches().get(0).getMedicine();
            String medicineName = medicine != null ? medicine.getName() : "Bilinmeyen İlaç";
            activityLogService.logCompartmentCreationNotification(
                    ownerUsername,
                    device.getName(),
                    medicineName,
                    false
            );
            throw e;
        }
    }

    public void sendCompartmentUpdated(Compartment c) {
        CompartmentNotificationDto dto = buildCompartmentDto(c, "UPDATED");
        notifyPiForSyncAfterCommit(c.getDevice());
        broadcastToAll(c.getDevice(), "/compartment", dto);
    }

    public void sendCompartmentDeleted(Compartment c) {
        CompartmentNotificationDto dto = buildCompartmentDto(c, "DELETED");
        notifyPiForSyncAfterCommit(c.getDevice());
        broadcastToAll(c.getDevice(), "/compartment", dto);

    }


    @Async
    public void notifyPiForSync(Device device) {
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(2))
                    .build();

            client.send(java.net.http.HttpRequest.newBuilder()
                            .uri(java.net.URI.create(piSyncUrl))
                            .POST(java.net.http.HttpRequest.BodyPublishers.noBody())
                            .build(),
                    java.net.http.HttpResponse.BodyHandlers.ofString());

            System.out.println("✅ Pi senkronize edildi: " + device.getName());

        } catch (Exception e) {
            System.err.println("❌ Pi'ye bildirim gönderilemedi: " + e.getMessage());
        }
    }


    private void notifyPiForSyncAfterCommit(Device device) {
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override public void afterCommit() {
                        notifyPiForSync(device);
                    }
                }
        );
    }


    // ════════════ HAP OLAYLARI ════════════

    public void sendPillDropped(PillInstance pi) {
        PillNotificationDto dto = buildPillDto(pi, "DROPPED");
        Device device = pi.getBatch().getCompartment().getDevice();
        try {
            broadcastToAll(device, "", dto);
            // Log başarılı
            activityLogService.logPillDropNotification(
                    device.getOwner().getUsername(),
                    device.getName(),
                    pi.getBatch().getMedicine().getName(),
                    true
            );
        } catch (Exception e) {
            // Log başarısız
            activityLogService.logPillDropNotification(
                    device.getOwner().getUsername(),
                    device.getName(),
                    pi.getBatch().getMedicine().getName(),
                    false
            );
            throw e;
        }
    }

    public void sendPillTaken(PillInstance pi) {
        String event = (pi.getStatus() == PillStatus.TAKEN_ON_TIME) ? "TAKEN_ON_TIME" : "TAKEN_LATE";
        PillNotificationDto dto = buildPillDto(pi, event);
        Device device = pi.getBatch().getCompartment().getDevice();
        try {
            broadcastToAll(device, "", dto);
            // Log başarılı
            activityLogService.logNotificationSent(
                    device.getOwner().getUsername(),
                    "PILL_TAKEN",
                    String.format("İlaç alındı bildirimi: %s", pi.getBatch().getMedicine().getName()),
                    true
            );
        } catch (Exception e) {
            // Log başarısız
            activityLogService.logNotificationSent(
                    device.getOwner().getUsername(),
                    "PILL_TAKEN",
                    String.format("İlaç alındı bildirimi: %s", pi.getBatch().getMedicine().getName()),
                    false
            );
            throw e;
        }
    }

    /**
     * İlacın süresinde alınmadığı (MISSED) bildirimi
     */
    public void sendPillMissed(PillInstance pi) {
        // 1) DTO'yu hazırla
        PillNotificationDto dto = buildPillDto(pi, "MISSED");
        Device device           = pi.getBatch()
                .getCompartment()
                .getDevice();

        String medicineName = pi.getBatch().getMedicine().getName();

        try {
            /* ------------------ WEBSOCKET ------------------ */
            broadcastToAll(device, "", dto);

            /* -------------------- LOG ---------------------- */
            activityLogService.logNotificationSent(
                    device.getOwner().getUsername(),     // kullanıcının adı
                    "PILL_MISSED",                       // olay türü
                    String.format("İlaç kaçırma bildirimi: %s", medicineName),
                    true                                 // başarılı
            );

        } catch (Exception e) {

            /* ----------- Hata durumunda LOG ---------------- */
            activityLogService.logNotificationSent(
                    device.getOwner().getUsername(),
                    "PILL_MISSED",
                    String.format("İlaç kaçırma bildirimi: %s", medicineName),
                    false                                // başarısız
            );
            throw e;    // zincirleme hata yönetimi
        }
    }
    // ════════════ DTO OLUŞTURUCULAR ════════════

    private PillNotificationDto buildPillDto(PillInstance pi, String event) {
        Medicine m = pi.getBatch().getMedicine();
        Device d = pi.getBatch().getCompartment().getDevice();

        String title;
        String body;

        switch (event) {
            case "DROPPED" -> {
                title = "İlaç saati ";
                body  = "%s ilacınızı içme saatiniz gelmiştir. Hazneyi çekip alabilirsiniz."
                        .formatted(m.getName());
            }
            case "TAKEN_ON_TIME" -> {
                title = "Aferin! ";
                body  = "%s ilacınızı zamanında aldınız.".formatted(m.getName());
            }
            case "TAKEN_LATE" -> {
                title = "İlaç geç alındı ";
                body  = "%s ilacınızı belirlenen süreden sonra aldınız."
                        .formatted(m.getName());
            }
            case "MISSED" -> {
                title = "İlaç hâlâ haznede";
                body  = "%s ilacınızı planlanan sürede almadınız. Hap çekmecede bekliyor, lütfen şimdi alınız."
                        .formatted(m.getName());
            }
            default -> {
                title = "İlaç bildirimi";
                body  = m.getName();
            }
        }

        return PillNotificationDto.builder()
                .event(event)
                .title(title)
                .body(body)
                .pillInstanceId(pi.getId())
                .medicineName(m.getName())
                .dosage(m.getDosage())
                .deviceId(d.getId())
                .deviceName(d.getName())
                .compartmentIdx(null)
                .dispensedAt(pi.getDispensedAt())
                .consumedAt(pi.getConsumedAt())
                .status(pi.getStatus())
                .build();
    }

    private CompartmentNotificationDto buildCompartmentDto(Compartment c, String event) {
        Medicine m = c.getBatches().isEmpty()
                ? null
                : c.getBatches().get(0).getMedicine();

        int qty = c.getBatches().stream()
                .mapToInt(b -> b.getQuantity())
                .sum();

        List<LocalDateTime> dates = c.getBatches().isEmpty()
                ? List.of()
                : c.getBatches().get(0).getInstances().stream()
                .map(PillInstance::getScheduledAt)
                .toList();

        DateTimeFormatter fmt = DateTimeFormatter
                .ofPattern("d MMMM HH:mm")
                .withLocale(Locale.forLanguageTag("tr-TR"));

        String datesStr = dates.stream()
                .map(d -> d.format(fmt))
                .collect(Collectors.joining(", "));

        String title;
        String body;

        switch (event) {
            case "CREATED" -> {
                title = "İlaç yüklendi ";
                body  = "%d numaralı çekmeceye %s ilacınızdan %d adet eklendi."
                        .formatted(c.getIdx(), m.getName(), qty, datesStr);
            }
            case "UPDATED" -> {
                title = "Çekmece güncellendi ";
                body  = "%d numaralı çekmece %s ilacıyla güncellendi. Çekmecedeki hapları yeni haplarla değiştirmeyi unutmayın.\nYeni tarihler: %s"
                        .formatted(c.getIdx(), m.getName(), datesStr);
            }
            case "DELETED" -> {
                title = "İlaç silindi ";
                body  = "%s ilacınız plandan kaldırıldı. Çekmecedeki hapları almayı unutmayın."
                        .formatted(m != null ? m.getName() : "İlaç");
            }
            default -> {
                title = "Çekmece bildirimi";
                body  = "";
            }
        }

        return CompartmentNotificationDto.builder()
                .event(event)
                .title(title)
                .body(body)
                .compartmentId(c.getId())
                .idx(c.getIdx())
                .deviceId(c.getDevice().getId())
                .deviceName(c.getDevice().getName())
                .medicineName(m != null ? m.getName() : null)
                .dosage(m != null ? m.getDosage() : null)
                .quantity(qty)
                .scheduleList(dates)
                .build();
    }
}