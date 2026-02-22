package com.akilha.tracker.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompartmentSummaryDto {
    private Long compartmentId;
    private int idx;
    private String medicineName;
    private String medicineDosage;
    private int currentStock;
    private List<PillInstanceSummaryDto> scheduleSummary;
}