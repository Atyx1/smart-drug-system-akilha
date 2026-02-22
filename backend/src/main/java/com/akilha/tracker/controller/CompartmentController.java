package com.akilha.tracker.controller;



import com.akilha.message.Messages;
import com.akilha.message.ResponseBuilder;
import com.akilha.tracker.dto.CompartmentCreateAndUpdateRequest;
import com.akilha.tracker.dto.CompartmentDto;
import com.akilha.tracker.dto.CompartmentSummaryDto;
import com.akilha.tracker.service.CompartmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;




import com.akilha.message.ApiResponse;

@RestController
@RequestMapping("/compartments")
@RequiredArgsConstructor
public class CompartmentController {

    private final CompartmentService compartmentService;

    /** ✅ Yeni çekmece oluştur (cihaz sahibi) */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> create(@RequestBody @Valid CompartmentCreateAndUpdateRequest request) {
        compartmentService.create(request);
        return ResponseBuilder.created(
                null,
                Messages.getMessageForLocale("compartment.create.success", LocaleContextHolder.getLocale())
        );
    }

    /** ✅ Mevcut çekmeceyi güncelle (cihaz sahibi) */
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<Void>> update(@RequestBody @Valid CompartmentCreateAndUpdateRequest request) throws AccessDeniedException {
        compartmentService.updateByCurrentUserAndIdx(request);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("compartment.update.success", LocaleContextHolder.getLocale())
        );
    }

    /** ✅ Çekmeceyi deviceId ve idx ile sil (cihaz sahibi) */
    @DeleteMapping("/device/{deviceId}/idx/{idx}")
    public ResponseEntity<ApiResponse<Void>> deleteByDeviceAndIdx(@PathVariable Long deviceId, @PathVariable int idx) throws AccessDeniedException {
        compartmentService.deleteByDeviceAndIdx(deviceId, idx);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("compartment.delete.success", LocaleContextHolder.getLocale())
        );
    }


    /**
     * ✅ Cihaza ait tüm çekmecelerin detaylı özetini getir (viewer veya manager)
     */
    @GetMapping("/device/{deviceId}")
    public ResponseEntity<ApiResponse<List<CompartmentSummaryDto>>> list(@PathVariable Long deviceId) throws AccessDeniedException {
        List<CompartmentSummaryDto> compartmentsSummary = compartmentService.listFront(deviceId);
        return ResponseBuilder.success(
                compartmentsSummary,
                Messages.getMessageForLocale("compartment.list.success", LocaleContextHolder.getLocale())
        );
    }
}