
package com.akilha.tracker.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CompartmentNotificationDto {

    private String  event;          // CREATED | UPDATED | DELETED
    private Long    compartmentId;
    private int     idx;            // (#1, #2 …)

    private Long    deviceId;
    private String  deviceName;

    // İlaç bilgisi
    private String  medicineName;
    private String  dosage;
    private int     quantity;

    private List<LocalDateTime> scheduleList;

    /* ▶️  Mobilde göstermek için */
    private String  title;          // yeni
    private String  body;           // yeni
}