package com.akilha.approve;




import com.akilha.device.entity.Device;
import com.akilha.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface PendingApprovalRepository extends JpaRepository<PendingApproval, Long> {

    /* Eski metot duruyor */
    @Query("SELECT pa FROM PendingApproval pa WHERE pa.user.email = :email")
    Optional<PendingApproval> findByUserEmail(@Param("email") String email);

    /* ▼ Viewer isteklerini çeken yeniler ▼ */

    List<PendingApproval> findByDeviceAndType(Device device, ApprovalType type);

    Optional<PendingApproval> findByDeviceAndUserAndType(Device d, User u, ApprovalType t);
}