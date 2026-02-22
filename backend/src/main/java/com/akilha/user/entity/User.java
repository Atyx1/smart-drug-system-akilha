package com.akilha.user.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;


@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "username")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private static final Logger log = LoggerFactory.getLogger(User.class);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String fullName;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @JsonIgnore
    private String password;

    @JsonIgnore
    private boolean active = false;

    @JsonIgnore
    private String activationCode;

    @JsonIgnore
    private String passwordResetCode;


    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_deleted")
    private boolean deleted = false;  // Soft delete için

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;  // Silinme tarihi

    public User(String aa, String mail, String user123, Role role, boolean b) {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public User(String username, String fullName, String email, String password) {
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.status = UserStatus.PENDING;
        this.role = Role.USER;
    }



}

