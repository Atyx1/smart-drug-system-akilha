package com.akilha.logging.dto;

import lombok.Data;
import java.time.LocalDateTime;
import com.akilha.logging.entity.ActivityType;

@Data
public class ActivityLogResponse {
    private Long id;
    private LocalDateTime timestamp;
    private String username;

    private ActivityType actionType;
    private String actionTypeDescription;
    private String description;
    private String details;
} 