package com.milly.backend.controller;

import com.milly.backend.dto.CheckinRequest;
import com.milly.backend.entity.Checkin;
import com.milly.backend.repository.CheckinRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CheckinController {

    private final CheckinRepository checkinRepository;

    public CheckinController(CheckinRepository checkinRepository) {
        this.checkinRepository = checkinRepository;
    }

    @PostMapping("/checkin")
    public ResponseEntity<Checkin> createCheckin(@RequestBody CheckinRequest request) {
        Checkin checkin = new Checkin(
                request.getMood(),
                request.getStress(),
                request.getSleepHours(),
                request.getNightmares(),
                request.getFlashbacks(),
                request.getTriggers()
        );
        Checkin saved = checkinRepository.save(checkin);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/checkins")
    public ResponseEntity<List<Checkin>> getCheckins() {
        return ResponseEntity.ok(checkinRepository.findByUserIdOrderByCreatedAtDesc(1L));
    }
}
