package com.akilha.tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.akilha.tracker.entity.Compartment;
import com.akilha.tracker.entity.MedicineBatch;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineBatchRepository extends JpaRepository<MedicineBatch, Long> {



    List<MedicineBatch> findByCompartment(Compartment compartment);

    Optional<MedicineBatch> findTopByCompartmentOrderByLoadedAtDesc(Compartment compartment);




}