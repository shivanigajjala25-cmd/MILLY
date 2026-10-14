package com.milly.backend.controller;

import com.milly.backend.dto.JournalRequest;
import com.milly.backend.entity.JournalEntry;
import com.milly.backend.entity.User;
import com.milly.backend.repository.JournalEntryRepository;
import com.milly.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * PRIVATE JOURNAL REST CONTROLLER.
 * Strict architectural isolation: No AI service is injected or called in this controller.
 */
@RestController
@RequestMapping("/api/journal")
@CrossOrigin(origins = "*")
public class JournalController {

    private final JournalEntryRepository journalRepository;
    private final UserRepository userRepository;

    // Default prototype PIN: "1234"
    private static final String DEFAULT_PIN = "1234";

    public JournalController(JournalEntryRepository journalRepository, UserRepository userRepository) {
        this.journalRepository = journalRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/verify-pin")
    public ResponseEntity<Map<String, Object>> verifyPin(@RequestBody Map<String, String> payload) {
        String enteredPin = payload.get("pin");
        Map<String, Object> resp = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(1L);
        String correctPin = userOpt.map(User::getPinHash).orElse(DEFAULT_PIN);

        if (enteredPin != null && enteredPin.equals(correctPin)) {
            resp.put("authenticated", true);
            resp.put("message", "PIN verified successfully.");
            return ResponseEntity.ok(resp);
        } else {
            resp.put("authenticated", false);
            resp.put("message", "Invalid PIN. Access denied.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }
    }

    @PostMapping("/set-pin")
    public ResponseEntity<Map<String, Object>> setPin(@RequestBody Map<String, String> payload) {
        String newPin = payload.get("pin");
        Map<String, Object> resp = new HashMap<>();

        if (newPin == null || newPin.length() < 4) {
            resp.put("success", false);
            resp.put("message", "PIN must be at least 4 digits.");
            return ResponseEntity.badRequest().body(resp);
        }

        User user = userRepository.findById(1L).orElse(new User("demo_user", DEFAULT_PIN));
        user.setPinHash(newPin);
        userRepository.save(user);

        resp.put("success", true);
        resp.put("message", "PIN updated successfully.");
        return ResponseEntity.ok(resp);
    }

    @GetMapping
    public ResponseEntity<List<JournalEntry>> getEntries() {
        return ResponseEntity.ok(journalRepository.findByUserIdOrderByCreatedAtDesc(1L));
    }

    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(@RequestBody JournalRequest request) {
        JournalEntry entry = new JournalEntry(
                request.getTitle() != null ? request.getTitle() : "Untitled Entry",
                request.getContent() != null ? request.getContent() : "",
                request.getMoodTag() != null ? request.getMoodTag() : "Personal"
        );
        JournalEntry saved = journalRepository.save(entry);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalEntry> updateEntry(@PathVariable Long id, @RequestBody JournalRequest request) {
        Optional<JournalEntry> opt = journalRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        JournalEntry entry = opt.get();
        if (request.getTitle() != null) entry.setTitle(request.getTitle());
        if (request.getContent() != null) entry.setContent(request.getContent());
        if (request.getMoodTag() != null) entry.setMoodTag(request.getMoodTag());
        entry.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(journalRepository.save(entry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEntry(@PathVariable Long id) {
        journalRepository.deleteById(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Journal entry deleted.");
        return ResponseEntity.ok(resp);
    }
}
