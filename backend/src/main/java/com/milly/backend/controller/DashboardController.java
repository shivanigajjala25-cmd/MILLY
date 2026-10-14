package com.milly.backend.controller;

import com.milly.backend.dto.DashboardResponse;
import com.milly.backend.entity.Checkin;
import com.milly.backend.repository.CheckinRepository;
import com.milly.backend.repository.GroundingSessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final CheckinRepository checkinRepository;
    private final GroundingSessionRepository groundingRepository;

    public DashboardController(CheckinRepository checkinRepository, GroundingSessionRepository groundingRepository) {
        this.checkinRepository = checkinRepository;
        this.groundingRepository = groundingRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        DashboardResponse resp = new DashboardResponse();
        List<Checkin> checkins = checkinRepository.findByUserIdOrderByCreatedAtDesc(1L);
        long groundingCount = groundingRepository.countByUserId(1L);
        resp.setGroundingSessionsCount(groundingCount);

        if (checkins.isEmpty()) {
            resp.setCurrentMood("Calm");
            resp.setCurrentStress(3);
            resp.setCurrentSleep(7.0);
            resp.setWeeklyAverageStress(3.0);
            resp.setWeeklyAverageSleep(7.0);
            resp.setRecentCheckins(Collections.emptyList());

            List<DashboardResponse.DayPoint> defaultPoints = Arrays.asList(
                    new DashboardResponse.DayPoint("Mon", 4, 6.5),
                    new DashboardResponse.DayPoint("Tue", 5, 6.0),
                    new DashboardResponse.DayPoint("Wed", 4, 7.0),
                    new DashboardResponse.DayPoint("Thu", 3, 7.5),
                    new DashboardResponse.DayPoint("Fri", 5, 6.0),
                    new DashboardResponse.DayPoint("Sat", 4, 7.0),
                    new DashboardResponse.DayPoint("Sun", 3, 7.5)
            );
            resp.setWeeklyData(defaultPoints);
            resp.setDescriptiveInsight("Welcome to MILLY. Complete your first daily check-in to begin visualizing your stress and sleep trends.");
            return ResponseEntity.ok(resp);
        }

        Checkin latest = checkins.get(0);
        resp.setCurrentMood(latest.getMood());
        resp.setCurrentStress(latest.getStress());
        resp.setCurrentSleep(latest.getSleepHours());
        resp.setRecentCheckins(checkins.stream().limit(7).toList());

        // Calculate weekly metrics
        List<Checkin> weeklyList = checkins.stream().limit(7).toList();
        double totalStress = 0.0;
        double totalSleep = 0.0;
        int stressCount = 0;
        int sleepCount = 0;

        List<DashboardResponse.DayPoint> chartPoints = new ArrayList<>();
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEE");

        // Reverse to show chronological order Mon -> Sun
        List<Checkin> chronological = new ArrayList<>(weeklyList);
        Collections.reverse(chronological);

        for (Checkin c : chronological) {
            String dayStr = (c.getCreatedAt() != null) ? c.getCreatedAt().format(dayFormatter) : "Day";
            chartPoints.add(new DashboardResponse.DayPoint(dayStr, c.getStress(), c.getSleepHours()));

            if (c.getStress() != null) {
                totalStress += c.getStress();
                stressCount++;
            }
            if (c.getSleepHours() != null) {
                totalSleep += c.getSleepHours();
                sleepCount++;
            }
        }

        double avgStress = stressCount > 0 ? Math.round((totalStress / stressCount) * 10.0) / 10.0 : 0.0;
        double avgSleep = sleepCount > 0 ? Math.round((totalSleep / sleepCount) * 10.0) / 10.0 : 0.0;
        resp.setWeeklyAverageStress(avgStress);
        resp.setWeeklyAverageSleep(avgSleep);
        resp.setWeeklyData(chartPoints);

        // Formulate non-diagnostic descriptive insight
        StringBuilder insight = new StringBuilder();
        insight.append(String.format("Your average stress this week was %.1f/10 across logged check-ins. ", avgStress));
        if (avgSleep > 0) {
            insight.append(String.format("Average reported sleep duration was %.1f hours. ", avgSleep));
        }
        if (avgStress >= 6.5) {
            insight.append("Your stress levels have been elevated recently. Remember to give yourself moments of rest and pacing. If you have concerns about recurring symptoms, consider discussing them with a qualified mental health professional.");
        } else {
            insight.append("Your metrics reflect steady resilience this week. Keep utilizing your grounding toolkit whenever unexpected triggers arise.");
        }
        resp.setDescriptiveInsight(insight.toString());

        return ResponseEntity.ok(resp);
    }
}
