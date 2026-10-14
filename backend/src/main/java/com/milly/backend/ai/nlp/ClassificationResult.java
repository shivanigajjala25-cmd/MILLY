package com.milly.backend.ai.nlp;

import java.io.Serializable;
import java.util.Map;

/**
 * Result of classifier prediction.
 */
public class ClassificationResult implements Serializable {

    private static final long serialVersionUID = 1L;

    private final String label;
    private final double confidence;
    private final Map<String, Double> allProbabilities;

    public ClassificationResult(String label, double confidence, Map<String, Double> allProbabilities) {
        this.label = label;
        this.confidence = confidence;
        this.allProbabilities = allProbabilities;
    }

    public String getLabel() {
        return label;
    }

    public double getConfidence() {
        return confidence;
    }

    public Map<String, Double> getAllProbabilities() {
        return allProbabilities;
    }
}
