package com.akilha.token;


import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @Column(nullable = false,unique = true)
    private Long userId;
    private   String prefix;
    // Token.java
    @Column(length = 2048, nullable = false, unique = true)
    private String token;


    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Token(String prefix, String token) {
        this.prefix = prefix;
        this.token = token;
    }

}

