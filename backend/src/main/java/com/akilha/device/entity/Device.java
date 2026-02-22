package com.akilha.device.entity;


import com.akilha.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;


import lombok.*;

@Entity
@Table(name = "devices", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Device {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String name;


    @Column(nullable = false)
    private String password;

    /* -------- roller -------- */
    /** Kutunun tek yöneticisi (manager) */
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "owner_id", nullable = true)

    private User owner;

    /** Sadece görüntüleme-bildirim hakkı olan izleyiciler */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "device_viewers",
            joinColumns = @JoinColumn(name = "device_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> viewers = new HashSet<>();
}