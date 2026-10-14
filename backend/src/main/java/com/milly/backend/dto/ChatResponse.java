package com.milly.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class ChatResponse {

    private String response;
    private String intent;
    private String emotion;
    private double confidence;
    private boolean crisis;

    @JsonProperty("retrieved_topics")
    private List<String> retrievedTopics;

    @JsonProperty("recommended_action")
    private String recommendedAction;

    public ChatResponse() {}

    public ChatResponse(String response, String intent, String emotion, double confidence,
                        boolean crisis, List<String> retrievedTopics, String recommendedAction) {
        this.response = response;
        this.intent = intent;
        this.emotion = emotion;
        this.confidence = confidence;
        this.crisis = crisis;
        this.retrievedTopics = retrievedTopics;
        this.recommendedAction = recommendedAction;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public boolean isCrisis() {
        return crisis;
    }

    public void setCrisis(boolean crisis) {
        this.crisis = crisis;
    }

    public List<String> getRetrievedTopics() {
        return retrievedTopics;
    }

    public void setRetrievedTopics(List<String> retrievedTopics) {
        this.retrievedTopics = retrievedTopics;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }
}
