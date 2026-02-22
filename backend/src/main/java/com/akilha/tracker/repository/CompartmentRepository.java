package com.akilha.tracker.repository;

import com.akilha.tracker.dto.CompartmentDto;
import com.akilha.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.akilha.tracker.entity.Compartment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompartmentRepository extends JpaRepository<Compartment, Long> {


    @Query("""
SELECT new com.akilha.tracker.dto.CompartmentDto(
         c.id,
         c.idx,
         m.name,
         m.dosage,
         COUNT(i),
         null 
)
FROM Compartment c
JOIN c.device d
JOIN c.batches b
JOIN b.medicine m
JOIN b.instances i
WHERE d.id = :deviceId
  AND i.status IN ('PENDING', 'DISPENSED_WAITING')
GROUP BY c.id, c.idx, m.name, m.dosage
""")
    List<CompartmentDto> fetchCompartmentList(@Param("deviceId") Long deviceId);

    List<Compartment> findByDevice_IdOrderByIdxAsc(Long deviceId);

    Optional<Compartment> findByDevice_IdAndIdx(Long deviceId, int idx);


}
