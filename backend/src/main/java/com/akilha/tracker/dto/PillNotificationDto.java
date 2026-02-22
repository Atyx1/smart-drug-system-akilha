
package com.akilha.tracker.dto;
import com.akilha.tracker.entity.PillStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PillNotificationDto {

    private String event;
    private String title;
    private String body;

    private Long pillInstanceId;
    private String medicineName;
    private String dosage;
    private Long deviceId;
    private String deviceName;
    private Integer compartmentIdx;
    private LocalDateTime scheduledTime;
    private LocalDateTime dispensedAt;
    private LocalDateTime consumedAt;
    private PillStatus status;
}