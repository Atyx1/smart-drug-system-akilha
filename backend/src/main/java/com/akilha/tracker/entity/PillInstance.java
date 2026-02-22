package com.akilha.tracker.entity;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pill_instances",
        indexes = {
                @Index(name = "ix_status_time", columnList = "status, scheduledAt"),
                @Index(name = "ix_status", columnList = "status")
        })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PillInstance {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "batch_id", nullable = true)
    private MedicineBatch batch;

    /** Bu hapın içileceği planlı zaman */
    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PillStatus status = PillStatus.PENDING;

    /** Pi hapı düşürdüğünde set edilir */
    private LocalDateTime dispensedAt;

    /** Kamera hapın alındığını gördüğünde set edilir */
    private LocalDateTime consumedAt;

    public PillInstance(MedicineBatch batch, LocalDateTime scheduledAt) {
        this.batch = batch;
        this.scheduledAt = scheduledAt;
        this.status = PillStatus.PENDING;
    }
}