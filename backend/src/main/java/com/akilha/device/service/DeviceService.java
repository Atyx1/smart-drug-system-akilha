package com.akilha.device.service;

import com.akilha.approve.PendingApproval;
import com.akilha.approve.PendingApprovalService;
import com.akilha.approve.PendingApprovalDto;
import com.akilha.device.dto.DeviceCaregiverRequest;
import com.akilha.device.dto.DeviceRegisterRequest;
import com.akilha.device.dto.DeviceResponse;
import com.akilha.device.dto.DeviceUpdateRequest;
import com.akilha.device.entity.Device;
import com.akilha.device.exception.DeviceExceptions;
import com.akilha.device.repository.DeviceRepository;
import com.akilha.logging.service.ActivityLogService;
import com.akilha.user.entity.Role;
import com.akilha.user.entity.User;
import com.akilha.user.exception.UserExceptions;
import com.akilha.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepo;
    private final PendingApprovalService pendingService;
    private final UserService userService;
    private final ActivityLogService activityLogService;

    public Long getMyDeviceId() {
        User user = userService.getCurrentUser();

        return deviceRepo.findByOwner(user).stream()
                .map(Device::getId)
                .findFirst()
                .or(() -> deviceRepo.findByViewersContains(user).stream()
                        .map(Device::getId)
                        .findFirst()
                )
                .orElse(null);
    }

    /* ========= CRUD ========= */

    @Transactional
    public void register(DeviceRegisterRequest req) {
        User currentUser = userService.getCurrentUser();

        if (deviceRepo.findByName(req.getName()).isPresent()) {
            throw new DeviceExceptions.DeviceAlreadyExistsException(req.getName());
        }

        if (currentUser.getRole() != Role.MANAGER) {
            throw new UserExceptions.UnauthorizedException();
        }

        Device device = new Device(null, req.getName(), req.getPassword(), null, null);
        deviceRepo.save(device);
    }

    @Transactional
    public void connectDeviceAsAManager(DeviceRegisterRequest reg) {
        User currentUser = userService.getCurrentUser();

        Device device = deviceRepo.findByName(reg.getName())
                .orElseThrow(() -> new DeviceExceptions.DeviceNotFoundException());

        if (device.getOwner() != null) {
            throw new DeviceExceptions.DeviceAlreadyHasOwnerException(reg.getName());
        }

        if (device.getName().equals(reg.getName()) && device.getPassword().equals(reg.getPassword())) {
            currentUser.setRole(Role.MANAGER);
            device.setOwner(currentUser);
            userService.save(currentUser);
            deviceRepo.save(device);
        } else {
            throw new DeviceExceptions.InvalidDeviceCredentialsException();
        }
    }

    @Transactional
    public void update(Long deviceId, DeviceUpdateRequest req) {
        Device device = mustOwn(deviceId, userService.getCurrentUser());
        device.setName(req.getName());
        device.setPassword(req.getPassword());
        deviceRepo.save(device);
    }

    @Transactional
    public void delete(Long deviceId) {
        Device device = mustOwn(deviceId, userService.getCurrentUser());
        deviceRepo.delete(device);
    }

    /* ========= CAREGIVER FLOW ========= */

    @Transactional
    public void caregiverRequest(DeviceCaregiverRequest req) {
        User currentUser = userService.getCurrentUser();

        Device device = deviceRepo.findByName(req.getName())
                .orElseThrow(() -> new DeviceExceptions.DeviceNotFoundException());

        pendingService.addViewerRequest(device, currentUser);

        // Log: DEVICE_REQUEST_SUBMITTED
        activityLogService.logDeviceRequestSubmitted(
                currentUser.getUsername(),
                device.getName(),
                device.getId()
        );
    }

    @Transactional
    public List<PendingApprovalDto> pendingViewerRequests(Long deviceId) {
        Device device = mustOwn(deviceId, userService.getCurrentUser());
        List<PendingApproval> requests = pendingService.findViewerRequests(device, userService.getCurrentUser());
        return requests.stream()
                .map(PendingApprovalDto::fromEntity)
                .toList();
    }

    @Transactional
    public void approveViewer(Long approvalId) {
        User manager = userService.getCurrentUser();


        PendingApproval pending = pendingService.getViewerApproval(approvalId, manager);

        // Onay işlemini gerçekleştirelim
        pendingService.approveViewer(approvalId, manager);


        String requesterUsername = pending.getUser().getUsername();
        Device device = pending.getDevice();
        activityLogService.logDeviceRequestApproved(
                manager.getUsername(),
                requesterUsername,
                device.getName(),
                device.getId(),
                approvalId
        );
    }

    @Transactional
    public void rejectViewer(Long approvalId) {
        User manager = userService.getCurrentUser();

        // Önce ilgili PendingApproval nesnesini çekelim
        PendingApproval pending = pendingService.getViewerApproval(approvalId, manager);

        // Reddetme işlemini gerçekleştirelim
        pendingService.rejectViewer(approvalId, manager);

        // Log: DEVICE_REQUEST_REJECTED
        String requesterUsername = pending.getUser().getUsername();
        Device device = pending.getDevice();
        activityLogService.logDeviceRequestRejected(
                manager.getUsername(),
                requesterUsername,
                device.getName(),
                device.getId(),
                approvalId
        );
    }

    @Transactional
    public List<User> getApprovedViewers(Long deviceId, User currentUser) {
        // Viewers'ı eager olarak fetch et
        Device device = deviceRepo.findByIdWithViewers(deviceId)
                .orElseThrow(() -> new DeviceExceptions.DeviceNotFoundException());

        // Owner kontrolü
        if (device.getOwner() == null || !device.getOwner().getId().equals(currentUser.getId())) {
            throw new DeviceExceptions.DeviceAccessDeniedException();
        }

        return new ArrayList<>(device.getViewers());
    }

    @Transactional
    public void blockViewer(Long deviceId, Long userId) {

        User currentUser = userService.getCurrentUser();
        Device device = mustOwn(deviceId, currentUser);


        User userToBlock = userService.findById(userId);
        if (userToBlock == null) {
            throw new UserExceptions.UserNotFoundException();
        }


        if (device.getOwner().getId().equals(userId)) {
            throw new DeviceExceptions.CannotBlockOwnerException();
        }


        device.getViewers().remove(userToBlock);

        userToBlock.setRole(Role.USER);
        userService.save(userToBlock);

        deviceRepo.save(device);
    }

    /* ========= LIST ========= */

    @Transactional
    public List<DeviceResponse> myDevices(User user) {
        var owned = deviceRepo.findByOwner(user).stream().map(d -> toRes(d, true));
        var viewing = deviceRepo.findByViewersContains(user).stream().map(d -> toRes(d, false));
        return Stream.concat(owned, viewing).toList();
    }

    public Long findDeviceIdByUserEmail(String email) {
        return deviceRepo.findFirstByOwner_Email(email)
                .map(Device::getId)
                .or(() -> deviceRepo.findFirstByViewers_Email(email).map(Device::getId))
                .orElse(null);
    }

    /* ========= HELPER ========= */

    private Device mustOwn(Long id, User manager) {
        Device device = deviceRepo.findById(id)
                .orElseThrow(() -> new DeviceExceptions.DeviceNotFoundException());

        if (!device.getOwner().getId().equals(manager.getId())) {
            throw new DeviceExceptions.DeviceAccessDeniedException();
        }

        return device;
    }

    private DeviceResponse toRes(Device d, boolean manager) {
        DeviceResponse r = new DeviceResponse();
        r.setId(d.getId());
        r.setName(d.getName());
        r.setManager(manager);
        return r;
    }
}