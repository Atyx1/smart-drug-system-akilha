package com.akilha.device.controller;

import com.akilha.approve.PendingApproval;
import com.akilha.approve.PendingApprovalDto;
import com.akilha.device.dto.*;
import com.akilha.device.service.DeviceService;
import com.akilha.message.ApiResponse;
import com.akilha.message.Messages;
import com.akilha.message.ResponseBuilder;
import com.akilha.user.dto.UserDto;
import com.akilha.user.entity.User;
import com.akilha.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;
    private final UserService userService;

    @GetMapping("/my-device-id")
    public ResponseEntity<ApiResponse<Long>> getMyDeviceId() {
        Long deviceId = deviceService.getMyDeviceId();
        return ResponseBuilder.success(
                deviceId,
                Messages.getMessageForLocale("device.my.id.success", LocaleContextHolder.getLocale())
        );
    }

    /** -------- Manager: cihaz oluşturur -------- */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody DeviceRegisterRequest req) {
        deviceService.register(req);
        return ResponseBuilder.created(
                null,
                Messages.getMessageForLocale("device.register.success", LocaleContextHolder.getLocale())
        );
    }

    /** -------- Manager: cihaz bağlar -------- */
    @PostMapping("/connectForManager")
    public ResponseEntity<ApiResponse<Void>> connectDeviceAsAManager(@RequestBody DeviceRegisterRequest req) {
        deviceService.connectDeviceAsAManager(req);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("device.connect.success", LocaleContextHolder.getLocale())
        );
    }

    /** -------- Manager: cihaz günceller -------- */
    @PutMapping("/{deviceId}")
    public ResponseEntity<ApiResponse<Void>> update(
            @PathVariable Long deviceId,
            @RequestBody DeviceUpdateRequest req
    ) {
        deviceService.update(deviceId, req);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("device.update.success", LocaleContextHolder.getLocale())
        );
    }

    /** -------- Manager: cihaz siler -------- */
    @DeleteMapping("/{deviceId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long deviceId) {
        deviceService.delete(deviceId);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("device.delete.success", LocaleContextHolder.getLocale())
        );
    }

    /** -------- Caregiver: sadece cihaz adıyla istek atar -------- */
    @PostMapping("/caregiver/request")
    public ResponseEntity<ApiResponse<Void>> caregiverRequest(@RequestBody DeviceCaregiverRequest req) {
        deviceService.caregiverRequest(req);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("device.caregiver.request.sent", LocaleContextHolder.getLocale())
        );
    }

    /** -------- Manager: kendi cihazının bekleyen isteklerini listeler -------- */
    @GetMapping("/{deviceId}/caregiver/requests")
    public ResponseEntity<ApiResponse<List<PendingApprovalDto>>> getPendingRequests(@PathVariable Long deviceId) {
        List<PendingApprovalDto> requests = deviceService.pendingViewerRequests(deviceId);
        return ResponseBuilder.success(
                requests,
                Messages.getMessageForLocale("device.caregiver.requests.success", LocaleContextHolder.getLocale())
        );
    }

    /** -------- Manager: caregiver isteğini onaylar -------- */
    @PostMapping("/caregiver/requests/{approvalId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveRequest(@PathVariable Long approvalId) {
        deviceService.approveViewer(approvalId);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("device.caregiver.approve.success", LocaleContextHolder.getLocale())
        );
    }

    /** -------- Manager: caregiver isteğini reddeder -------- */
    @PostMapping("/caregiver/requests/{approvalId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectRequest(@PathVariable Long approvalId) {
        deviceService.rejectViewer(approvalId);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("device.caregiver.reject.success", LocaleContextHolder.getLocale())
        );
    }

    @GetMapping("/{deviceId}/caregiver/approved")
    public ResponseEntity<List<UserDto>> getApprovedViewers(@PathVariable Long deviceId) {
        List<User> viewers = deviceService.getApprovedViewers(deviceId, userService.getCurrentUser());
        List<UserDto> dtos = viewers.stream().map(UserDto::new).toList();
        return ResponseEntity.ok(dtos);
    }

    /** -------- Manager: viewer'ın erişimini kaldırır -------- */
    @PostMapping("/{deviceId}/caregiver/{userId}/block")
    public ResponseEntity<ApiResponse<Void>> blockViewer(
            @PathVariable Long deviceId,
            @PathVariable Long userId
    ) {
        deviceService.blockViewer(deviceId, userId);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("device.caregiver.block.success", LocaleContextHolder.getLocale())
        );
    }

    /** -------- Herkes: bağlı olduğu cihazları görür -------- */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<DeviceResponse>>> myDevices() {
        List<DeviceResponse> devices = deviceService.myDevices(userService.getCurrentUser());
        return ResponseBuilder.success(
                devices,
                Messages.getMessageForLocale("device.my.list.success", LocaleContextHolder.getLocale())
        );
    }
}