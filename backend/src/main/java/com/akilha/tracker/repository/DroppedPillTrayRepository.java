package com.akilha.tracker.repository;

import com.akilha.tracker.entity.DroppedPillTray;
import com.akilha.tracker.entity.PillInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;


public interface DroppedPillTrayRepository extends JpaRepository<DroppedPillTray, Long> {


    List<DroppedPillTray> findByPillInstance_Batch_Compartment_Device_Id(Long deviceId);







    void deleteAll();

}