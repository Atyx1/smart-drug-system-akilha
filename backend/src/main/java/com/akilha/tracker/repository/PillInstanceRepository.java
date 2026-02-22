package com.akilha.tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.akilha.tracker.entity.Compartment;
import com.akilha.tracker.entity.PillInstance;
import com.akilha.tracker.entity.PillStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PillInstanceRepository extends JpaRepository<PillInstance, Long> {




    @Query("""
SELECT i.scheduledAt
FROM PillInstance i
WHERE i.batch.compartment.id = :compId
  AND i.status IN ('PENDING', 'DISPENSED_WAITING')
ORDER BY i.scheduledAt
""")
    List<LocalDateTime> pendingDates(@Param("compId") Long compId);
    List<PillInstance> findByBatch_CompartmentAndStatus(Compartment compartment,
                                                        PillStatus status);





    void deleteByBatch_CompartmentAndStatus(Compartment compartment, PillStatus status);

    boolean existsByBatch_CompartmentAndStatus(Compartment c, PillStatus status);




    // "Compartment ve status != PENDING olan"
    List<PillInstance> findByBatch_CompartmentAndStatusNot(Compartment c, PillStatus status);


}