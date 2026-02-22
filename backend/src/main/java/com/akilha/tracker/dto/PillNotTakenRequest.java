package com.akilha.tracker.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PillNotTakenRequest {

    @NotNull
    private Long pillInstanceId;
}
