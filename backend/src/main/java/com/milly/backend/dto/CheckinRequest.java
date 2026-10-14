package com.milly.backend.dto;

public class CheckinRequest {

    private String mood;
    private Integer stress;
    private Double sleepHours;
    private Boolean nightmares = false;
    private Boolean flashbacks = false;
    private String triggers;

    public CheckinRequest() {}

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
}
