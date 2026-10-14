package com.milly.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "grounding_sessions")
public class GroundingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId = 1L;

    @Column(nullable = false)
    private String exerciseType; // 5-4-3-2-1, box_breathing, pmr, safe_place, calm_mode

    private Integer durationSeconds;

    private LocalDateTime completedAt;

    public GroundingSession() {
        this.completedAt = LocalDateTime.now();
    }

    public GroundingSession(String exerciseType, Integer durationSeconds) {
        this();
        this.exerciseType = exerciseType;
        this.durationSeconds = durationSeconds != null ? durationSeconds : 60;
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

    public String getExerciseType() {
        return exerciseType;
    }

    public void setExerciseType(String exerciseType) {
        this.exerciseType = exerciseType;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
