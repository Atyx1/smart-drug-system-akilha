package com.akilha.device.repository;



import com.akilha.device.entity.Device;
import com.akilha.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    Optional<Device> findByName(String name);

    List<Device> findByOwner(User owner);
    List<Device> findByViewersContains(User viewer);
    Optional<Device> findFirstByOwner_Email(String email);
    Optional<Device> findFirstByViewers_Email(String email);
    Optional<Device> findByOwner_Id(Long ownerId);
    
    @Query("SELECT d FROM Device d LEFT JOIN FETCH d.viewers WHERE d.id = :deviceId")
    Optional<Device> findByIdWithViewers(@Param("deviceId") Long deviceId);
}