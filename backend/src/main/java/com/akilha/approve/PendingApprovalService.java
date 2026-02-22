package com.akilha.approve;

import com.akilha.device.entity.Device;
import com.akilha.device.repository.DeviceRepository;
import com.akilha.logging.service.ActivityLogService;
import com.akilha.user.entity.Role;
import com.akilha.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PendingApprovalService {

    private final PendingApprovalRepository pendingRepo;
    private final DeviceRepository deviceRepo;
    private final ActivityLogService activityLogService;

    /* ===================== VIEWER FLOW ===================== */

    /** Cihaz doğrulaması dışarıda yapılmış olmalı */
    @Transactional
    public void addViewerRequest(Device device, User viewer) {
        if (device.getOwner().equals(viewer) || device.getViewers().contains(viewer)) {
            return;
        }

        if (pendingRepo.findByDeviceAndUserAndType(device, viewer, ApprovalType.DEVICE_VIEWER).isPresent()) {
            return;
        }

        PendingApproval pa = new PendingApproval();
        pa.setUser(viewer);
        pa.setDevice(device);
        pa.setType(ApprovalType.DEVICE_VIEWER);
        pa.setRequestDate(LocalDate.now());
        pendingRepo.save(pa);

        // Log: İstek gönderildi
        activityLogService.logDeviceRequestSubmitted(
            viewer.getUsername(), 
            device.getName(), 
            device.getId()
        );
    }

    /** Manager bekleyen viewer isteklerini listeler */
    @Transactional
    public List<PendingApproval> findViewerRequests(Device device, User manager) {
        if (!device.getOwner().equals(manager)) {
            throw new ApprovalExceptions.ViewerApprovalAccessDeniedException();
        }

        return pendingRepo.findByDeviceAndType(device, ApprovalType.DEVICE_VIEWER);
    }

    /** Viewer onayı için pending kaydı döner, yetkiler kontrol edilir */
    @Transactional
    public PendingApproval getViewerApproval(Long id, User manager) {
        PendingApproval pa = pendingRepo.findById(id)
                .orElseThrow(() -> new ApprovalExceptions.ApprovalNotFoundException(id));

        if (pa.getType() != ApprovalType.DEVICE_VIEWER) {
            throw new ApprovalExceptions.NotViewerRequestException();
        }

        if (!pa.getDevice().getOwner().equals(manager)) {
            throw new ApprovalExceptions.ViewerApprovalAccessDeniedException();
        }

        return pa;
    }

    /** Onaylama işlemi */
    @Transactional
    public void approveViewer(Long approvalId, User manager) {
        PendingApproval pa = getViewerApproval(approvalId, manager);
        Device device = pa.getDevice();

        pa.getUser().setRole(Role.ADMIN);
        device.getViewers().add(pa.getUser());

        deviceRepo.save(device);
        pendingRepo.delete(pa);


        activityLogService.logDeviceRequestApproved(
            manager.getUsername(),
            pa.getUser().getUsername(),
            device.getName(),
            device.getId(),
            approvalId
        );
    }

    /** Red işlemi */
    @Transactional
    public void rejectViewer(Long approvalId, User manager) {
        PendingApproval pa = getViewerApproval(approvalId, manager);
        

        String requesterUsername = pa.getUser().getUsername();
        String deviceName = pa.getDevice().getName();
        Long deviceId = pa.getDevice().getId();
        
        pendingRepo.delete(pa);


        activityLogService.logDeviceRequestRejected(
            manager.getUsername(),
            requesterUsername,
            deviceName,
            deviceId,
            approvalId
        );
    }



    /** Direkt silme */
    @Transactional
    public void delete(PendingApproval pa) {
        pendingRepo.delete(pa);
    }
}