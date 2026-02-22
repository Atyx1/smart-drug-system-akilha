package com.akilha.tracker.controller;

import com.akilha.message.ApiResponse;
import com.akilha.message.Messages;
import com.akilha.message.ResponseBuilder;
import com.akilha.tracker.dto.PillDropRequest;
import com.akilha.tracker.dto.PillNotTakenRequest;
import com.akilha.tracker.service.PillDropService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pills")
@RequiredArgsConstructor
public class PillController {

    private final PillDropService pillDropService;

    /**
     * ✅ 1. İlacın cihaza düşürüldüğü bildirimi (Raspberry Pi tetikler)
     */
    @PostMapping("/{deviceId}/drop")
    public ResponseEntity<ApiResponse<Void>> confirmDrop(
            @PathVariable Long deviceId,
            @RequestBody @Valid PillDropRequest request
    ) {
        pillDropService.confirmDrop(deviceId, request);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("pill.drop.success", LocaleContextHolder.getLocale())
        );
    }

    /**
     * ✅ 3. Hazne boşsa sistem bunu bildirir, alındı kabul edilir (Raspberry Pi tetikler)
     */
    @PostMapping("/{deviceId}/tray-emptied")
    public ResponseEntity<ApiResponse<Void>> confirmTrayEmptied(@PathVariable Long deviceId) {
        pillDropService.confirmTrayEmptied(deviceId);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("pill.tray.emptied", LocaleContextHolder.getLocale())
        );
    }

    /**
     * ✅ 4. Düşen ilaç 10 dk içinde alınmadıysa (Raspberry Pi tetikler)
     */
    @PostMapping("/{deviceId}/not-taken")
    public ResponseEntity<ApiResponse<Void>> confirmNotTaken(
            @PathVariable Long deviceId,
            @RequestBody @Valid PillNotTakenRequest request
    ) {
        pillDropService.confirmNotTaken(deviceId, request);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("pill.not.taken", LocaleContextHolder.getLocale())
        );
    }
}