package com.milly.backend.controller;

import com.milly.backend.ai.model.KnowledgeArticle;
import com.milly.backend.ai.model.ModelMetrics;
import com.milly.backend.ai.nlp.ClassificationResult;
import com.milly.backend.ai.service.EmotionClassifierService;
import com.milly.backend.ai.service.IntentClassifierService;
import com.milly.backend.ai.service.KnowledgeRetrievalService;
import com.milly.backend.ai.service.ResponseEngineService;
import com.milly.backend.ai.service.SafetyDetectorService;
import com.milly.backend.dto.ChatRequest;
import com.milly.backend.dto.ChatResponse;
import com.milly.backend.entity.Checkin;
import com.milly.backend.repository.CheckinRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final IntentClassifierService intentClassifier;
    private final EmotionClassifierService emotionClassifier;
    private final SafetyDetectorService safetyDetector;
    private final KnowledgeRetrievalService knowledgeRetriever;
    private final ResponseEngineService responseEngine;
    private final CheckinRepository checkinRepository;

    public ChatController(
            IntentClassifierService intentClassifier,
            EmotionClassifierService emotionClassifier,
            SafetyDetectorService safetyDetector,
            KnowledgeRetrievalService knowledgeRetriever,
            ResponseEngineService responseEngine,
            CheckinRepository checkinRepository) {
        this.intentClassifier = intentClassifier;
        this.emotionClassifier = emotionClassifier;
        this.safetyDetector = safetyDetector;
        this.knowledgeRetriever = knowledgeRetriever;
        this.responseEngine = responseEngine;
        this.checkinRepository = checkinRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("app", "MILLY PTSD Companion");
        status.put("intentModelReady", intentClassifier.isReady());
        status.put("emotionModelReady", emotionClassifier.isReady());
        return ResponseEntity.ok(status);
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String userText = (request.getMessage() != null) ? request.getMessage().trim() : "";
        String sessionId = (request.getSessionId() != null) ? request.getSessionId() : "default";

        if (userText.isEmpty()) {
            return ResponseEntity.ok(new ChatResponse(
                    "I am here whenever you are ready to speak.",
                    "greeting",
                    "neutral",
                    1.0,
                    false,
                    Collections.emptyList(),
                    "none"
            ));
        }

        // STEP 1: SAFETY / CRISIS DETECTION FIRST (Before normal response pipeline)
        SafetyDetectorService.SafetyCheckResult safetyCheck = safetyDetector.checkSafety(userText);
        if (safetyCheck.isCrisis()) {
            return ResponseEntity.ok(new ChatResponse(
                    safetyCheck.getEmergencyMessage(),
                    "crisis",
                    "distress",
                    0.99,
                    true,
                    Arrays.asList("Emergency Resources", "Crisis Support"),
                    "emergency"
            ));
        }

        // STEP 2: INTENT CLASSIFICATION
        ClassificationResult intentResult = intentClassifier.classify(userText);
        String intent = intentResult.getLabel();
        double intentConfidence = intentResult.getConfidence();

        // STEP 3: EMOTION CLASSIFICATION
        ClassificationResult emotionResult = emotionClassifier.classify(userText);
        String emotion = emotionResult.getLabel();

        // STEP 4: KNOWLEDGE RETRIEVAL (Top 2-3 relevant topics via TF-IDF Cosine Similarity)
        List<KnowledgeArticle> retrievedArticles = knowledgeRetriever.retrieveRelevant(userText, 3);

        // STEP 5: PERSONALIZATION WITH STRUCTURED WELLNESS DATA (If permitted)
        String wellnessContext = null;
        if (Boolean.TRUE.equals(request.getAllowWellnessContext())) {
            List<Checkin> recent = checkinRepository.findTop7ByUserIdOrderByCreatedAtDesc(1L);
            if (!recent.isEmpty()) {
                Checkin latest = recent.get(0);
                if (latest.getStress() != null && latest.getStress() >= 7) {
                    wellnessContext = "Note: Your recent check-in shows higher stress (" + latest.getStress() + "/10). Take it gently today.";
                } else if (latest.getSleepHours() != null && latest.getSleepHours() < 5.0) {
                    wellnessContext = "Note: Your recent check-in indicated less sleep (" + latest.getSleepHours() + " hrs). Rest is essential.";
                }
            }
        }

        // STEP 6: RESPONSE ENGINE (Natural response synthesis)
        ResponseEngineService.GeneratedResponse response = responseEngine.generateResponse(
                sessionId,
                userText,
                intent,
                emotion,
                retrievedArticles,
                wellnessContext
        );

        return ResponseEntity.ok(new ChatResponse(
                response.getText(),
                intent,
                emotion,
                Math.round(intentConfidence * 100.0) / 100.0,
                false,
                response.getRetrievedTopicTitles(),
                response.getRecommendedAction()
        ));
    }

    @GetMapping("/chat/metrics")
    public ResponseEntity<Map<String, Object>> getModelMetrics() {
        Map<String, Object> data = new HashMap<>();
        ModelMetrics intentMetrics = intentClassifier.getEvaluationMetrics();
        ModelMetrics emotionMetrics = emotionClassifier.getEvaluationMetrics();

        if (intentMetrics != null) {
            Map<String, Object> im = new HashMap<>();
            im.put("accuracy", intentMetrics.getAccuracy());
            im.put("precision", intentMetrics.getPrecision());
            im.put("recall", intentMetrics.getRecall());
            im.put("f1Score", intentMetrics.getF1Score());
            im.put("totalSamples", intentMetrics.getTotalSamples());
            im.put("classF1", intentMetrics.getClassF1Scores());
            data.put("intentModel", im);
        }

        if (emotionMetrics != null) {
            Map<String, Object> em = new HashMap<>();
            em.put("accuracy", emotionMetrics.getAccuracy());
            em.put("precision", emotionMetrics.getPrecision());
            em.put("recall", emotionMetrics.getRecall());
            em.put("f1Score", emotionMetrics.getF1Score());
            em.put("totalSamples", emotionMetrics.getTotalSamples());
            em.put("classF1", emotionMetrics.getClassF1Scores());
            data.put("emotionModel", em);
        }

        return ResponseEntity.ok(data);
    }

    @GetMapping("/knowledge")
    public ResponseEntity<List<KnowledgeArticle>> getKnowledgeBase() {
        return ResponseEntity.ok(knowledgeRetriever.getAllArticles());
    }
}
