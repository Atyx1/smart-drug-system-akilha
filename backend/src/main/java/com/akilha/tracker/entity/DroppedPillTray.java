package com.akilha.tracker.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DroppedPillTray {
    
    /**
     * Constructor for creating a DroppedPillTray with just pill instance and dropped time
     * @param pillInstance the pill instance being dropped
     * @param droppedAt the timestamp when the pill was dropped
     */
    public DroppedPillTray(PillInstance pillInstance, LocalDateTime droppedAt) {
        this.pillInstance = pillInstance;
        this.droppedAt = droppedAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private PillInstance pillInstance;

    private LocalDateTime droppedAt;



}