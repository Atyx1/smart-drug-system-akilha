package com.akilha.tracker.entity;


import com.akilha.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicines")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Medicine {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 60)
    private String dosage;

    /** İlacı tanımlayan kullanıcı (her hasta kendi ilaç setini tutar) */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "is_deleted")
    private boolean deleted = false;

}