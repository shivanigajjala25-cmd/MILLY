package com.milly.backend.ai.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * Safety & Crisis Detection Service.
 * Evaluates user input BEFORE response generation for immediate crisis intervention.
 */
@Service
public class SafetyDetectorService {

    public static class SafetyCheckResult {
        private final boolean isCrisis;
        private final String triggerPhrase;
        private final String emergencyMessage;

        public SafetyCheckResult(boolean isCrisis, String triggerPhrase, String emergencyMessage) {
            this.isCrisis = isCrisis;
            this.triggerPhrase = triggerPhrase;
            this.emergencyMessage = emergencyMessage;
        }

        public boolean isCrisis() {
            return isCrisis;
        }

        public String getTriggerPhrase() {
            return triggerPhrase;
        }

        public String getEmergencyMessage() {
            return emergencyMessage;
        }
    }

    private static final String CRISIS_RESPONSE =
            "I'm really sorry you're going through this. I can't provide emergency care, " +
            "but you deserve immediate human support. Please contact a trusted person, " +
            "a mental-health professional, or your local emergency/crisis service. " +
            "If you're in immediate danger, contact emergency services now.";

    private static final List<String> CRISIS_KEYWORDS = Arrays.asList(
            "i want to die",
            "want to die",
            "i want to kill myself",
            "kill myself",
            "i don't want to live",
            "dont want to live",
            "i want to hurt myself",
            "hurt myself",
            "i am going to end my life",
            "end my life",
            "i cant keep myself safe",
            "cannot keep myself safe",
            "commit suicide",
            "suicide",
            "end it all",
            "overdose and die",
            "suicidal thoughts",
            "better off dead",
            "goodbye cruel world"
    );

    public SafetyCheckResult checkSafety(String text) {
        if (text == null || text.trim().isEmpty()) {
            return new SafetyCheckResult(false, null, null);
        }

        String normalized = text.toLowerCase()
                .replace("'", "")
                .replace("’", "")
                .replaceAll("\\s+", " ")
                .trim();

        for (String phrase : CRISIS_KEYWORDS) {
            if (normalized.contains(phrase)) {
                return new SafetyCheckResult(true, phrase, CRISIS_RESPONSE);
            }
        }

        return new SafetyCheckResult(false, null, null);
    }
}
