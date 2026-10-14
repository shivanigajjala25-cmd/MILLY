package com.milly.backend.dto;

public class GroundingCompletedRequest {

    private String exerciseType;
    private Integer durationSeconds;

    public GroundingCompletedRequest() {}

    public GroundingCompletedRequest(String exerciseType, Integer durationSeconds) {
        this.exerciseType = exerciseType;
        this.durationSeconds = durationSeconds;
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
}
