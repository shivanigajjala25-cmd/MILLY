package com.milly.backend.ai.model;

import java.io.Serializable;
import java.util.Map;

/**
 * Encapsulates standard Machine Learning evaluation metrics:
 * Accuracy, Macro-averaged Precision, Recall, and F1 Score.
 */
public class ModelMetrics implements Serializable {

    private static final long serialVersionUID = 1L;

    private final double accuracy;
    private final double precision;
    private final double recall;
    private final double f1Score;
    private final int totalSamples;
    private final Map<String, Double> classF1Scores;

    public ModelMetrics(double accuracy, double precision, double recall, double f1Score,
                        int totalSamples, Map<String, Double> classF1Scores) {
        this.accuracy = accuracy;
        this.precision = precision;
        this.recall = recall;
        this.f1Score = f1Score;
        this.totalSamples = totalSamples;
        this.classF1Scores = classF1Scores;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public double getPrecision() {
        return precision;
    }

    public double getRecall() {
        return recall;
    }

    public double getF1Score() {
        return f1Score;
    }

    public int getTotalSamples() {
        return totalSamples;
    }

    public Map<String, Double> getClassF1Scores() {
        return classF1Scores;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Evaluation Metrics (Total Samples: %d):%n", totalSamples));
        sb.append(String.format(" - Accuracy:  %.4f (%.2f%%)%n", accuracy, accuracy * 100));
        sb.append(String.format(" - Precision: %.4f%n", precision));
        sb.append(String.format(" - Recall:    %.4f%n", recall));
        sb.append(String.format(" - F1-Score:  %.4f%n", f1Score));
        if (classF1Scores != null && !classF1Scores.isEmpty()) {
            sb.append("Per-Class F1 Scores:\n");
            for (Map.Entry<String, Double> entry : classF1Scores.entrySet()) {
                sb.append(String.format("   %-22s : %.4f%n", entry.getKey(), entry.getValue()));
            }
        }
        return sb.toString();
    }
}
