package com.akilha.logging.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs", indexes = {
    @Index(name = "idx_timestamp", columnList = "timestamp"),
    @Index(name = "idx_username", columnList = "username"),

    @Index(name = "idx_action_type", columnList = "action_type")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "username", length = 100)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type")
    private ActivityType actionType;


    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;


} 