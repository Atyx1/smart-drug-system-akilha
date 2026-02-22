package com.akilha.approve;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingApprovalDto {
    private Long id;
    private String userEmail;
    private String userFullName;
    private LocalDate requestDate;
    private ApprovalType type;
    private Long deviceId;
    private String deviceName;

    public static PendingApprovalDto fromEntity(PendingApproval entity) {
        PendingApprovalDto dto = new PendingApprovalDto();
        dto.setId(entity.getId());
        dto.setUserEmail(entity.getUser().getEmail());
        dto.setUserFullName(entity.getUser().getFullName());
        dto.setRequestDate(entity.getRequestDate());
        dto.setType(entity.getType());
        
        if (entity.getDevice() != null) {
            dto.setDeviceId(entity.getDevice().getId());
            dto.setDeviceName(entity.getDevice().getName());
        }
        
        return dto;
    }
} 