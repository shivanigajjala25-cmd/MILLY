package com.milly.backend.dto;

public class ChatRequest {

    private String message;
    private String sessionId;
    private Boolean allowWellnessContext = true;

    public ChatRequest() {}

    public ChatRequest(String message, String sessionId) {
        this.message = message;
        this.sessionId = sessionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Boolean getAllowWellnessContext() {
        return allowWellnessContext;
    }

    public void setAllowWellnessContext(Boolean allowWellnessContext) {
        this.allowWellnessContext = allowWellnessContext;
    }
}
