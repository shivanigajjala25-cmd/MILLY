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
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * PRIVATE JOURNAL REST CONTROLLER.
 * Strict architectural isolation: No AI service is injected or called in this controller.
 */
@RestController
@RequestMapping("/api/journal")
public class JournalController {

    private final JournalEntryRepository journalRepository;
    private final UserRepository userRepository;

    private static final String SESSION_HEADER = "X-Journal-Session";
    private static final BCryptPasswordEncoder PIN_ENCODER = new BCryptPasswordEncoder();
    private final Map<String, LocalDateTime> activeSessions = new ConcurrentHashMap<>();

    public JournalController(JournalEntryRepository journalRepository, UserRepository userRepository) {
        this.journalRepository = journalRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/verify-pin")
    public ResponseEntity<Map<String, Object>> verifyPin(@RequestBody Map<String, String> payload) {
        String enteredPin = payload.get("pin");
        Map<String, Object> resp = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(1L);
        String correctPin = userOpt.map(User::getPinHash).orElse(null);

        if (enteredPin != null && pinMatches(enteredPin, correctPin)) {
            if (!correctPin.startsWith("bcrypt:")) {
                User user = userOpt.get();
                user.setPinHash(hashPin(enteredPin));
                userRepository.save(user);
            }
            String sessionToken = UUID.randomUUID().toString();
            activeSessions.put(sessionToken, LocalDateTime.now());
            resp.put("authenticated", true);
            resp.put("sessionToken", sessionToken);
            resp.put("message", "PIN verified successfully.");
            return ResponseEntity.ok(resp);
        } else {
            resp.put("authenticated", false);
            resp.put("message", "Invalid PIN. Access denied.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }
    }

    @PostMapping("/set-pin")
    public ResponseEntity<Map<String, Object>> setPin(
            @RequestHeader(value = SESSION_HEADER, required = false) String sessionToken,
            @RequestBody Map<String, String> payload) {
        String newPin = payload.get("pin");
        Map<String, Object> resp = new HashMap<>();

        if (!isAuthenticated(sessionToken)) {
            resp.put("success", false);
            resp.put("message", "Journal authentication required.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }

        if (newPin == null || !newPin.matches("\\d{8,}")) {
            resp.put("success", false);
            resp.put("message", "PIN must be at least 8 digits.");
            return ResponseEntity.badRequest().body(resp);
        }

        User user = userRepository.findById(1L).orElse(new User("demo_user", hashPin("1234")));
        user.setPinHash(hashPin(newPin));
        userRepository.save(user);

        resp.put("success", true);
        resp.put("message", "PIN updated successfully.");
        return ResponseEntity.ok(resp);
    }

    @GetMapping
    public ResponseEntity<List<JournalEntry>> getEntries(
            @RequestHeader(value = SESSION_HEADER, required = false) String sessionToken) {
        if (!isAuthenticated(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(journalRepository.findByUserIdOrderByCreatedAtDesc(1L));
    }

    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(
            @RequestHeader(value = SESSION_HEADER, required = false) String sessionToken,
            @RequestBody JournalRequest request) {
        if (!isAuthenticated(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        JournalEntry entry = new JournalEntry(
                request.getTitle() != null ? request.getTitle() : "Untitled Entry",
                request.getContent() != null ? request.getContent() : "",
                request.getMoodTag() != null ? request.getMoodTag() : "Personal"
        );
        JournalEntry saved = journalRepository.save(entry);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalEntry> updateEntry(
            @RequestHeader(value = SESSION_HEADER, required = false) String sessionToken,
            @PathVariable Long id, @RequestBody JournalRequest request) {
        if (!isAuthenticated(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
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
    public ResponseEntity<Map<String, Object>> deleteEntry(
            @RequestHeader(value = SESSION_HEADER, required = false) String sessionToken,
            @PathVariable Long id) {
        if (!isAuthenticated(sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!journalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        journalRepository.deleteById(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Journal entry deleted.");
        return ResponseEntity.ok(resp);
    }

    private boolean isAuthenticated(String sessionToken) {
        if (sessionToken == null) {
            return false;
        }
        LocalDateTime issuedAt = activeSessions.get(sessionToken);
        if (issuedAt == null) {
            return false;
        }
        if (issuedAt.plusMinutes(30).isBefore(LocalDateTime.now())) {
            activeSessions.remove(sessionToken);
            return false;
        }
        return true;
    }

    private boolean pinMatches(String enteredPin, String storedPin) {
        if (storedPin == null) {
            return false;
        }
        if (storedPin.startsWith("bcrypt:")) {
            return PIN_ENCODER.matches(enteredPin, storedPin.substring("bcrypt:".length()));
        }
        if (storedPin.startsWith("sha256:")) {
            return storedPin.equals(hashLegacyPin(enteredPin));
        }
        return storedPin.equals(enteredPin);
    }

    private static String hashPin(String pin) {
        return "bcrypt:" + PIN_ENCODER.encode(pin);
    }

    private static String hashLegacyPin(String pin) {
        try {
            byte[] digest = java.security.MessageDigest.getInstance("SHA-256")
                    .digest(pin.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return "sha256:" + HexFormat.of().formatHex(digest);
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
