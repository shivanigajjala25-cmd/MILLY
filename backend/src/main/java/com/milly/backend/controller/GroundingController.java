package com.milly.backend.controller;

import com.milly.backend.dto.GroundingCompletedRequest;
import com.milly.backend.entity.GroundingSession;
import com.milly.backend.repository.GroundingSessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grounding")
@CrossOrigin(origins = "*")
public class GroundingController {

    private final GroundingSessionRepository groundingRepository;

    public GroundingController(GroundingSessionRepository groundingRepository) {
        this.groundingRepository = groundingRepository;
    }

    @PostMapping("/completed")
    public ResponseEntity<GroundingSession> recordCompleted(@RequestBody GroundingCompletedRequest request) {
        GroundingSession session = new GroundingSession(
                request.getExerciseType() != null ? request.getExerciseType() : "grounding",
                request.getDurationSeconds() != null ? request.getDurationSeconds() : 60
        );
        GroundingSession saved = groundingRepository.save(session);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long count = groundingRepository.countByUserId(1L);
        List<GroundingSession> recent = groundingRepository.findByUserIdOrderByCompletedAtDesc(1L);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCompleted", count);
        stats.put("recentSessions", recent.stream().limit(5).toList());
        return ResponseEntity.ok(stats);
    }
}
