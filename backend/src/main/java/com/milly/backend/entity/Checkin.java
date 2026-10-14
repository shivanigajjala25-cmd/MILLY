package com.milly.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "checkins")
public class Checkin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId = 1L;

    @Column(nullable = false)
    private String mood; // Calm, Okay, Sad, Anxious, Angry, Fearful

    @Column(nullable = false)
    private Integer stress; // 1 to 10

    private Double sleepHours; // hours

    private Boolean nightmares = false;
    private Boolean flashbacks = false;

    private String triggers; // comma-separated or text

    private LocalDateTime createdAt;

    public Checkin() {
        this.createdAt = LocalDateTime.now();
    }

    public Checkin(String mood, Integer stress, Double sleepHours, Boolean nightmares, Boolean flashbacks, String triggers) {
        this();
        this.mood = mood;
        this.stress = stress;
        this.sleepHours = sleepHours;
        this.nightmares = nightmares != null ? nightmares : false;
        this.flashbacks = flashbacks != null ? flashbacks : false;
        this.triggers = triggers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public Integer getStress() {
        return stress;
    }

    public void setStress(Integer stress) {
        this.stress = stress;
    }

    public Double getSleepHours() {
        return sleepHours;
    }

    public void setSleepHours(Double sleepHours) {
        this.sleepHours = sleepHours;
    }

    public Boolean getNightmares() {
        return nightmares;
    }

    public void setNightmares(Boolean nightmares) {
        this.nightmares = nightmares;
    }

    public Boolean getFlashbacks() {
        return flashbacks;
    }

    public void setFlashbacks(Boolean flashbacks) {
        this.flashbacks = flashbacks;
    }

    public String getTriggers() {
        return triggers;
    }

    public void setTriggers(String triggers) {
        this.triggers = triggers;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
