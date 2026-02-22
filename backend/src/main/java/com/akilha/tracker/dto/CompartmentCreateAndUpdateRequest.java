package com.akilha.tracker.dto;



import com.akilha.tracker.entity.Medicine;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Manager yeni çekmece eklerken gönderilen istek.
 */
@Data
public class CompartmentCreateAndUpdateRequest {


    @NotNull
    private Long deviceId;

    @Min(value = 1, message = "Çekmece numarası 1–4 arası olmalı")
    @Max(value = 4, message = "Çekmece numarası 1–4 arası olmalı")
    private int idx;

    @NotNull
    private Medicine medicine;

    @Positive(message = "Adet pozitif olmalı")
    private int quantity;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @Size(min = 1, message = "En az bir içim saati girilmeli")
    private List<@NotNull @Future(message = "İçim saatleri ileri tarihli olmalı") LocalDateTime> scheduleList;
}
