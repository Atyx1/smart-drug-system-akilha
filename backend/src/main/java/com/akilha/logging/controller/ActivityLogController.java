package com.akilha.logging.controller;

import com.akilha.configuration.security.SecurityUtil;
import com.akilha.logging.dto.ActivityLogResponse;
import com.akilha.logging.entity.ActivityLog;
import com.akilha.logging.entity.ActivityType;
import com.akilha.logging.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/logs")
public class ActivityLogController {
    private final ActivityLogService activityLogService;
    private final SecurityUtil securityUtil;

    @Autowired
    public ActivityLogController(ActivityLogService activityLogService, SecurityUtil securityUtil) {
        this.activityLogService = activityLogService;
        this.securityUtil = securityUtil;
    }

    @GetMapping("/daily")
    public ResponseEntity<List<ActivityLogResponse>> getDailyLogs(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {

        List<ActivityLogResponse> logs = activityLogService.getLogsForDay(date)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/device-activities")
    public ResponseEntity<List<ActivityLogResponse>> getDeviceActivities(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {

        
        // Sadece cihaz ilgili aktiviteleri filtrele
        List<ActivityType> deviceRelatedTypes = Arrays.asList(
            ActivityType.DEVICE_REQUEST_SUBMITTED,
            ActivityType.DEVICE_REQUEST_APPROVED,
            ActivityType.DEVICE_REQUEST_REJECTED,
            ActivityType.DEVICE_VIEWER_ADDED,
            ActivityType.DEVICE_VIEWER_REMOVED
        );
        
        List<ActivityLogResponse> logs = activityLogService.getLogsForDay(date)
            .stream()
            .filter(log -> deviceRelatedTypes.contains(log.getActionType()))
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/pill-activities")
    public ResponseEntity<List<ActivityLogResponse>> getPillActivities(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {

        
        // Sadece ilaç ilgili aktiviteleri filtrele
        List<ActivityType> pillRelatedTypes = Arrays.asList(
            ActivityType.COMPARTMENT_CREATED,
            ActivityType.COMPARTMENT_UPDATED,
            ActivityType.MEDICINE_ADDED,
            ActivityType.MEDICINE_UPDATED,
            ActivityType.PILL_DROPPED,
            ActivityType.PILL_TAKEN,
            ActivityType.PILL_NOT_TAKEN,
            ActivityType.PILL_DISPENSED
        );
        
        List<ActivityLogResponse> logs = activityLogService.getLogsForDay(date)
            .stream()
            .filter(log -> pillRelatedTypes.contains(log.getActionType()))
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/notification-activities")
    public ResponseEntity<List<ActivityLogResponse>> getNotificationActivities(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {

        
        // Sadece bildirim ilgili aktiviteleri filtrele
        List<ActivityType> notificationRelatedTypes = Arrays.asList(
            ActivityType.NOTIFICATION_SENT,
            ActivityType.NOTIFICATION_FAILED,
            ActivityType.PILL_DROP_NOTIFICATION,
            ActivityType.COMPARTMENT_CREATION_NOTIFICATION
        );
        
        List<ActivityLogResponse> logs = activityLogService.getLogsForDay(date)
            .stream()
            .filter(log -> notificationRelatedTypes.contains(log.getActionType()))
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ActivityLogResponse>> getLogsForDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(required = false) String category
    ) {

        
        List<ActivityLogResponse> logs = activityLogService.getLogsForDateRange(startDate, endDate)
            .stream()
            .filter(log -> {
                if (category == null || category.isEmpty() || "ALL".equals(category)) {
                    return true;
                }
                
                switch (category.toUpperCase()) {
                    case "DEVICE":
                        return Arrays.asList(
                            ActivityType.DEVICE_REQUEST_SUBMITTED,
                            ActivityType.DEVICE_REQUEST_APPROVED,
                            ActivityType.DEVICE_REQUEST_REJECTED,
                            ActivityType.DEVICE_VIEWER_ADDED,
                            ActivityType.DEVICE_VIEWER_REMOVED
                        ).contains(log.getActionType());
                        
                    case "PILL":
                        return Arrays.asList(
                            ActivityType.COMPARTMENT_CREATED,
                            ActivityType.COMPARTMENT_UPDATED,
                            ActivityType.MEDICINE_ADDED,
                            ActivityType.MEDICINE_UPDATED,
                            ActivityType.PILL_DROPPED,
                            ActivityType.PILL_TAKEN,
                            ActivityType.PILL_NOT_TAKEN,
                            ActivityType.PILL_DISPENSED
                        ).contains(log.getActionType());
                        
                    case "NOTIFICATION":
                        return Arrays.asList(
                            ActivityType.NOTIFICATION_SENT,
                            ActivityType.NOTIFICATION_FAILED,
                            ActivityType.PILL_DROP_NOTIFICATION,
                            ActivityType.COMPARTMENT_CREATION_NOTIFICATION
                        ).contains(log.getActionType());
                        
                    default:
                        return true;
                }
            })
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/activity-types")
    public ResponseEntity<List<ActivityTypeInfo>> getActivityTypes() {

        
        List<ActivityTypeInfo> types = Arrays.stream(ActivityType.values())
            .map(type -> new ActivityTypeInfo(type.name(), type.getDescription()))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(types);
    }

    private ActivityLogResponse convertToResponse(ActivityLog log) {
        ActivityLogResponse response = new ActivityLogResponse();
        response.setId(log.getId());
        response.setTimestamp(log.getTimestamp());
        response.setUsername(log.getUsername());
        response.setActionType(log.getActionType());
        response.setActionTypeDescription(log.getActionType().getDescription());
        response.setDescription(log.getDescription());
        response.setDetails(log.getDetails());
        return response;
    }

    // İç sınıf: ActivityType bilgileri için
    public static class ActivityTypeInfo {
        public final String name;
        public final String description;

        public ActivityTypeInfo(String name, String description) {
            this.name = name;
            this.description = description;
        }

        // Getters
        public String getName() { return name; }
        public String getDescription() { return description; }
    }
} 