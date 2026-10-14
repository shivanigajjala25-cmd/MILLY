package com.milly.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String pinHash;
    private boolean shareWellnessWithAi;
    private LocalDateTime createdAt;

    public User() {
        this.createdAt = LocalDateTime.now();
        this.shareWellnessWithAi = true;
    }

    public User(String username, String pinHash) {
        this();
        this.username = username;
        this.pinHash = pinHash;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPinHash() {
        return pinHash;
    }

    public void setPinHash(String pinHash) {
        this.pinHash = pinHash;
    }

    public boolean isShareWellnessWithAi() {
        return shareWellnessWithAi;
    }

    public void setShareWellnessWithAi(boolean shareWellnessWithAi) {
        this.shareWellnessWithAi = shareWellnessWithAi;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
