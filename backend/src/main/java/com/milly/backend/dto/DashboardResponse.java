package com.milly.backend.dto;

import com.milly.backend.entity.Checkin;
import java.util.List;

public class DashboardResponse {

    public static class DayPoint {
        private String day;
        private Integer stress;
        private Double sleep;

        public DayPoint() {}

        public DayPoint(String day, Integer stress, Double sleep) {
            this.day = day;
            this.stress = stress;
            this.sleep = sleep;
        }

        public String getDay() {
            return day;
        }

        public void setDay(String day) {
            this.day = day;
        }

        public Integer getStress() {
            return stress;
        }

        public void setStress(Integer stress) {
            this.stress = stress;
        }

        public Double getSleep() {
            return sleep;
        }

        public void setSleep(Double sleep) {
            this.sleep = sleep;
        }
    }

    private String currentMood;
    private Integer currentStress;
    private Double currentSleep;
    private Double weeklyAverageStress;
    private Double weeklyAverageSleep;
    private long groundingSessionsCount;
    private List<Checkin> recentCheckins;
    private List<DayPoint> weeklyData;
    private String descriptiveInsight;

    public DashboardResponse() {}

    public String getCurrentMood() {
        return currentMood;
    }

    public void setCurrentMood(String currentMood) {
        this.currentMood = currentMood;
    }

    public Integer getCurrentStress() {
        return currentStress;
    }

    public void setCurrentStress(Integer currentStress) {
        this.currentStress = currentStress;
    }

    public Double getCurrentSleep() {
        return currentSleep;
    }

    public void setCurrentSleep(Double currentSleep) {
        this.currentSleep = currentSleep;
    }

    public Double getWeeklyAverageStress() {
        return weeklyAverageStress;
    }

    public void setWeeklyAverageStress(Double weeklyAverageStress) {
        this.weeklyAverageStress = weeklyAverageStress;
    }

    public Double getWeeklyAverageSleep() {
        return weeklyAverageSleep;
    }

    public void setWeeklyAverageSleep(Double weeklyAverageSleep) {
        this.weeklyAverageSleep = weeklyAverageSleep;
    }

    public long getGroundingSessionsCount() {
        return groundingSessionsCount;
    }

    public void setGroundingSessionsCount(long groundingSessionsCount) {
        this.groundingSessionsCount = groundingSessionsCount;
    }

    public List<Checkin> getRecentCheckins() {
        return recentCheckins;
    }

    public void setRecentCheckins(List<Checkin> recentCheckins) {
        this.recentCheckins = recentCheckins;
    }

    public List<DayPoint> getWeeklyData() {
        return weeklyData;
    }

    public void setWeeklyData(List<DayPoint> weeklyData) {
        this.weeklyData = weeklyData;
    }

    public String getDescriptiveInsight() {
        return descriptiveInsight;
    }

    public void setDescriptiveInsight(String descriptiveInsight) {
        this.descriptiveInsight = descriptiveInsight;
    }
}
