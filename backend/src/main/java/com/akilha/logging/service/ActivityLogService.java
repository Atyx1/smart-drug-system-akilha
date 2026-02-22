package com.akilha.logging.service;

import com.akilha.logging.entity.ActivityLog;
import com.akilha.logging.entity.ActivityType;
import com.akilha.logging.repository.ActivityLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public ActivityLogService(ActivityLogRepository activityLogRepository, ObjectMapper objectMapper) { 
        this.activityLogRepository = activityLogRepository;
        this.objectMapper = objectMapper;
        this.objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    }

    // ===================== GENEL LOG METODU =====================
    @Async
    public void logActivity(String username, ActivityType actionType, String description, Object details, boolean isSuccess) {
        try {
            String serializedDetails = safeSerializeDetails(details, isSuccess);

            ActivityLog log = ActivityLog.builder()
                .timestamp(LocalDateTime.now())
                .username(username)
                .actionType(actionType)
                .description(description)
                .details(serializedDetails)
                .build();

            activityLogRepository.save(log);
        } catch (Exception e) {
            log.error("Aktivite logu kaydedilirken hata oluştu", e);
        }
    }

    // ===================== CİHAZ İSTEK/ONAY LOGLARİ =====================
    
    @Async
    public void logDeviceRequestSubmitted(String requesterUsername, String deviceName, Long deviceId) {
        Map<String, Object> details = new HashMap<>();
        details.put("deviceId", deviceId);
        details.put("deviceName", deviceName);
        details.put("action", "request_submitted");
        
        logActivity(requesterUsername, ActivityType.DEVICE_REQUEST_SUBMITTED,
                   String.format("%s kullanıcısı '%s' cihazına erişim isteği gönderdi", requesterUsername, deviceName),
                   details, true);
    }

    @Async
    public void logDeviceRequestApproved(String managerUsername, String requesterUsername, String deviceName, Long deviceId, Long approvalId) {
        Map<String, Object> details = new HashMap<>();
        details.put("deviceId", deviceId);
        details.put("deviceName", deviceName);
        details.put("requesterUsername", requesterUsername);
        details.put("approvalId", approvalId);
        details.put("action", "request_approved");
        
        logActivity(managerUsername, ActivityType.DEVICE_REQUEST_APPROVED,
                   String.format("%s kullanıcısının '%s' cihazına erişim isteği onaylandı", requesterUsername, deviceName),
                   details, true);
    }

    @Async
    public void logDeviceRequestRejected(String managerUsername, String requesterUsername, String deviceName, Long deviceId, Long approvalId) {
        Map<String, Object> details = new HashMap<>();
        details.put("deviceId", deviceId);
        details.put("deviceName", deviceName);
        details.put("requesterUsername", requesterUsername);
        details.put("approvalId", approvalId);
        details.put("action", "request_rejected");
        
        logActivity(managerUsername, ActivityType.DEVICE_REQUEST_REJECTED,
                   String.format("%s kullanıcısının '%s' cihazına erişim isteği reddedildi", requesterUsername, deviceName),
                   details, true);
    }


    @Async
    public void logCompartmentCreated(String managerUsername, String deviceName, Long deviceId, Integer compartmentIdx, String medicineName) {
        Map<String, Object> details = new HashMap<>();
        details.put("deviceId", deviceId);
        details.put("deviceName", deviceName);
        details.put("compartmentIdx", compartmentIdx);
        details.put("medicineName", medicineName);
        details.put("action", "compartment_created");
        
        logActivity(managerUsername, ActivityType.COMPARTMENT_CREATED,
                   String.format("'%s' cihazının %d. bölmesine '%s' ilacı eklendi", deviceName, compartmentIdx, medicineName),
                   details, true);
    }

    // ===================== İLAÇ DÜŞÜRME VE ALMA LOGLARİ =====================
    
    @Async
    public void logPillDropped(String deviceName, Long deviceId, Integer compartmentIdx, String medicineName, Long pillInstanceId) {
        Map<String, Object> details = new HashMap<>();
        details.put("deviceId", deviceId);
        details.put("deviceName", deviceName);
        details.put("compartmentIdx", compartmentIdx);
        details.put("medicineName", medicineName);
        details.put("pillInstanceId", pillInstanceId);
        details.put("action", "pill_dropped");
        
        logActivity("SYSTEM", ActivityType.PILL_DROPPED,
                   String.format("'%s' cihazının %d. bölmesinden '%s' ilacı düşürüldü", deviceName, compartmentIdx, medicineName),
                   details, true);
    }

    @Async
    public void logPillTaken(String username, String deviceName, Long deviceId, Integer compartmentIdx, String medicineName, Long pillInstanceId) {
        Map<String, Object> details = new HashMap<>();
        details.put("deviceId", deviceId);
        details.put("deviceName", deviceName);
        details.put("compartmentIdx", compartmentIdx);
        details.put("medicineName", medicineName);
        details.put("pillInstanceId", pillInstanceId);
        details.put("takenBy", username);
        details.put("action", "pill_taken");
        
        logActivity(username, ActivityType.PILL_TAKEN,
                   String.format("%s kullanıcısı '%s' cihazının %d. bölmesinden '%s' ilacını aldı", username, deviceName, compartmentIdx, medicineName),
                   details, true);
    }

    @Async
    public void logPillNotTaken(String deviceName,
                                Long  deviceId,
                                Integer compartmentIdx,
                                String medicineName,
                                Long  pillInstanceId) {

        Map<String, Object> details = new HashMap<>();
        details.put("deviceId",       deviceId);
        details.put("deviceName",     deviceName);
        details.put("compartmentIdx", compartmentIdx);
        details.put("medicineName",   medicineName);
        details.put("pillInstanceId", pillInstanceId);
        details.put("action",         "pill_not_taken");

        String msg = String.format(
                "'%s' cihazının %d. bölmesindeki '%s' (instance=%d) ilacı alınmadı.",
                deviceName, compartmentIdx, medicineName, pillInstanceId
        );

        logActivity("SYSTEM",
                ActivityType.PILL_NOT_TAKEN,
                msg,
                details,
                true);
    }

    // ===================== BİLDİRİM LOGLARİ =====================
    
    @Async
    public void logNotificationSent(String targetUsername, String notificationType, String message, boolean isSuccess) {
        Map<String, Object> details = new HashMap<>();
        details.put("targetUsername", targetUsername);
        details.put("notificationType", notificationType);
        details.put("message", message);
        details.put("action", "notification_sent");
        
        ActivityType activityType = isSuccess ? ActivityType.NOTIFICATION_SENT : ActivityType.NOTIFICATION_FAILED;
        String description = isSuccess ? 
            String.format("%s kullanıcısına '%s' bildirimi gönderildi", targetUsername, notificationType) :
            String.format("%s kullanıcısına '%s' bildirimi gönderilemedi", targetUsername, notificationType);
        
        logActivity("SYSTEM", activityType, description, details, isSuccess);
    }

    @Async
    public void logPillDropNotification(String targetUsername, String deviceName, String medicineName, boolean isSuccess) {
        Map<String, Object> details = new HashMap<>();
        details.put("targetUsername", targetUsername);
        details.put("deviceName", deviceName);
        details.put("medicineName", medicineName);
        details.put("notificationType", "PILL_DROP");
        details.put("action", "pill_drop_notification");
        
        String description = isSuccess ? 
            String.format("%s kullanıcısına '%s' ilacı düşürme bildirimi gönderildi", targetUsername, medicineName) :
            String.format("%s kullanıcısına '%s' ilacı düşürme bildirimi gönderilemedi", targetUsername, medicineName);
        
        logActivity("SYSTEM", ActivityType.PILL_DROP_NOTIFICATION, description, details, isSuccess);
    }

    @Async
    public void logCompartmentCreationNotification(String targetUsername, String deviceName, String medicineName, boolean isSuccess) {
        Map<String, Object> details = new HashMap<>();
        details.put("targetUsername", targetUsername);
        details.put("deviceName", deviceName);
        details.put("medicineName", medicineName);
        details.put("notificationType", "COMPARTMENT_CREATION");
        details.put("action", "compartment_creation_notification");
        
        String description = isSuccess ? 
            String.format("%s kullanıcısına '%s' ilacı bölme oluşturma bildirimi gönderildi", targetUsername, medicineName) :
            String.format("%s kullanıcısına '%s' ilacı bölme oluşturma bildirimi gönderilemedi", targetUsername, medicineName);
        
        logActivity("SYSTEM", ActivityType.COMPARTMENT_CREATION_NOTIFICATION, description, details, isSuccess);
    }

    // ===================== MEVCUT METODLAR =====================
    
    /**
     * Detayları güvenli bir şekilde JSON'a dönüştürür
     */
    private String safeSerializeDetails(Object details, boolean isSuccess) {
        return safeSerializeDetails(details, isSuccess, null);
    }
    
    /**
     * Detayları ve ek bilgileri güvenli bir şekilde JSON'a dönüştürür
     */
    private String safeSerializeDetails(Object details, boolean isSuccess, Map<String, Object> additionalDetails) {
        try {
            Map<String, Object> detailsMap = new HashMap<>();
            
            // Başarı durumunu ekle
            detailsMap.put("success", isSuccess);
            
            // Detayları güvenli bir şekilde ekle
            if (details != null) {
                if (details instanceof Map) {
                    // Map tipindeki detayları doğrudan ekle
                    detailsMap.putAll((Map<String, Object>) details);
                } else {
                    // Entity nesnelerini özet bilgilerle değiştir
                    Map<String, Object> safeData = createSafeEntityMap(details);
                    detailsMap.put("data", safeData);
                }
            }
            
            // Ek bilgileri ekle
            if (additionalDetails != null) {
                detailsMap.putAll(additionalDetails);
            }
            
            return objectMapper.writeValueAsString(detailsMap);
        } catch (Exception e) {
            log.warn("Detaylar serileştirilemedi, basit detaylar kullanılacak", e);
            try {
                // Hata olduğunda sadece basit bilgileri içeren detayları gönder
                Map<String, Object> fallbackDetails = new HashMap<>();
                fallbackDetails.put("success", isSuccess);
                fallbackDetails.put("serialization_error", "Detaylar serileştirilemedi: " + e.getMessage());
                if (details != null) {
                    fallbackDetails.put("entity_type", details.getClass().getName());
                }
                return objectMapper.writeValueAsString(fallbackDetails);
            } catch (Exception ex) {
                log.error("Fallback detaylar bile serileştirilemedi", ex);
                return "{}";
            }
        }
    }
    
    /**
     * Entity nesnelerinden güvenli bir özet harita oluşturur
     */
    private Map<String, Object> createSafeEntityMap(Object entity) {
        Map<String, Object> safeMap = new HashMap<>();
        if (entity == null) {
            return safeMap;
        }
        
        try {
            // Sınıf adını ekle
            safeMap.put("entity_type", entity.getClass().getSimpleName());
            
            // Entity'nin ID alanını bulmaya çalış
            try {
                java.lang.reflect.Method idGetter = entity.getClass().getMethod("getId");
                Object id = idGetter.invoke(entity);
                if (id != null) {
                    safeMap.put("id", id.toString());
                }
            } catch (NoSuchMethodException e) {
                // getId metodu yoksa sessizce geç
            }
            
            // toString metodu varsa kullan
            safeMap.put("toString", entity.toString());
        } catch (Exception e) {
            log.warn("Entity güvenli haritaya dönüştürülemedi", e);
        }
        
        return safeMap;
    }

    public List<ActivityLog> getLogsForDay(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return activityLogRepository.findByTimestampBetweenOrderByTimestampDesc(startOfDay, endOfDay);
    }

    public List<ActivityLog> getLogsForDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startOfDay = startDate.atStartOfDay();
        LocalDateTime endOfDay = endDate.atTime(LocalTime.MAX);
        return activityLogRepository.findByTimestampBetweenOrderByTimestampDesc(startOfDay, endOfDay);
    }
} 