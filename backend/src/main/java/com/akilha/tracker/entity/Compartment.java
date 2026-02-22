package com.akilha.tracker.entity;

import com.akilha.device.entity.Device;
import com.akilha.tracker.validation.ValidCompartmentIndex;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "compartments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"idx", "device_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Compartment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ValidCompartmentIndex
    @Column(nullable = false)
    private int idx;


    @OneToMany(mappedBy = "compartment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicineBatch> batches = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "device_id")
    private Device device;
}