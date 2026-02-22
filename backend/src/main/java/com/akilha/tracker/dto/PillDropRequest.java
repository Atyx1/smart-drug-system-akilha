package com.akilha.tracker.dto;



import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PillDropRequest {
    @NotNull private Long pillInstanceId;
    @NotNull private Integer compartmentIdx;
}