package com.milly.backend.ai.nlp;

import com.milly.backend.ai.model.ModelMetrics;

import java.io.Serializable;
import java.util.*;

/**
 * Multinomial Logistic Regression (Softmax Regression) in Java.
 * Trained using Gradient Descent with Cross-Entropy Loss and L2 Regularization.
 * Evaluates full Accuracy, Precision, Recall, and F1 Score.
 */
public class LogisticRegressionClassifier implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<String> classes = new ArrayList<>();
    private Map<String, Integer> classToIndex = new HashMap<>();

    private double[][] weights; // [numClasses][featureDim]
    private double[] biases;     // [numClasses]
    private int featureDim;

    // Hyperparameters
    private double learningRate = 1.2;
    private double l2Lambda = 0.00005;
    private int epochs = 400;

    public LogisticRegressionClassifier() {}

    public LogisticRegressionClassifier(double learningRate, double l2Lambda, int epochs) {
        this.learningRate = learningRate;
        this.l2Lambda = l2Lambda;
        this.epochs = epochs;
    }

    /**
     * Trains the model on labeled feature vectors.
     */
    public void train(double[][] X, List<String> y) {
        if (X == null || X.length == 0 || y == null || y.isEmpty()) {
            throw new IllegalArgumentException("Training data cannot be empty.");
        }

        int nSamples = X.length;
        this.featureDim = X[0].length;

        // Extract unique classes
        Set<String> uniqueClasses = new LinkedHashSet<>(y);
        this.classes = new ArrayList<>(uniqueClasses);
        this.classToIndex = new HashMap<>();
        for (int i = 0; i < classes.size(); i++) {
            classToIndex.put(classes.get(i), i);
        }

        int numClasses = classes.size();
        this.weights = new double[numClasses][featureDim];
        this.biases = new double[numClasses];

        // Convert string labels to target one-hot vectors
        int[] targets = new int[nSamples];
        for (int i = 0; i < nSamples; i++) {
            targets[i] = classToIndex.get(y.get(i));
        }

        // Gradient Descent with learning rate decay
        for (int epoch = 0; epoch < epochs; epoch++) {
            double currentLr = learningRate / (1.0 + 0.001 * epoch);

            for (int i = 0; i < nSamples; i++) {
                double[] x = X[i];
                int targetClass = targets[i];

                // Compute logits z_k = W_k . x + b_k
                double[] logits = new double[numClasses];
                double maxLogit = Double.NEGATIVE_INFINITY;
                for (int k = 0; k < numClasses; k++) {
                    double dot = 0.0;
                    for (int d = 0; d < featureDim; d++) {
                        dot += weights[k][d] * x[d];
                    }
                    logits[k] = dot + biases[k];
                    if (logits[k] > maxLogit) {
                        maxLogit = logits[k];
                    }
                }

                // Softmax with numerical stabilization
                double sumExp = 0.0;
                double[] probs = new double[numClasses];
                for (int k = 0; k < numClasses; k++) {
                    probs[k] = Math.exp(logits[k] - maxLogit);
                    sumExp += probs[k];
                }
                for (int k = 0; k < numClasses; k++) {
                    probs[k] /= sumExp;
                }

                // Gradient update
                for (int k = 0; k < numClasses; k++) {
                    double error = probs[k] - (k == targetClass ? 1.0 : 0.0);

                    // Update bias
                    biases[k] -= currentLr * error;

                    // Update weights with L2 regularization
                    for (int d = 0; d < featureDim; d++) {
                        if (x[d] != 0.0) { // sparse speedup
                            double grad = error * x[d] + l2Lambda * weights[k][d];
                            weights[k][d] -= currentLr * grad;
                        }
                    }
                }
            }
        }
    }

    /**
     * Predicts class label and probabilities for a feature vector.
     */
    public ClassificationResult predict(double[] x) {
        if (weights == null || x == null || x.length != featureDim) {
            return new ClassificationResult("neutral", 0.0, Collections.emptyMap());
        }

        int numClasses = classes.size();
        double[] logits = new double[numClasses];
        double maxLogit = Double.NEGATIVE_INFINITY;

        for (int k = 0; k < numClasses; k++) {
            double dot = 0.0;
            for (int d = 0; d < featureDim; d++) {
                dot += weights[k][d] * x[d];
            }
            logits[k] = dot + biases[k];
            if (logits[k] > maxLogit) {
                maxLogit = logits[k];
            }
        }

        double sumExp = 0.0;
        double[] probs = new double[numClasses];
        for (int k = 0; k < numClasses; k++) {
            probs[k] = Math.exp(logits[k] - maxLogit);
            sumExp += probs[k];
        }

        Map<String, Double> probMap = new LinkedHashMap<>();
        int bestIdx = 0;
        double bestProb = -1.0;

        for (int k = 0; k < numClasses; k++) {
            probs[k] /= sumExp;
            String className = classes.get(k);
            probMap.put(className, probs[k]);
            if (probs[k] > bestProb) {
                bestProb = probs[k];
                bestIdx = k;
            }
        }

        return new ClassificationResult(classes.get(bestIdx), bestProb, probMap);
    }

    /**
     * Evaluates model on test data and returns Accuracy, Precision, Recall, and F1 Score.
     */
    public ModelMetrics evaluate(double[][] X_test, List<String> y_test) {
        int nSamples = X_test.length;
        int numClasses = classes.size();

        int[][] confusionMatrix = new int[numClasses][numClasses];
        int correct = 0;

        for (int i = 0; i < nSamples; i++) {
            ClassificationResult result = predict(X_test[i]);
            Integer trueIdx = classToIndex.get(y_test.get(i));
            Integer predIdx = classToIndex.get(result.getLabel());

            if (trueIdx != null && predIdx != null) {
                confusionMatrix[trueIdx][predIdx]++;
                if (trueIdx.equals(predIdx)) {
                    correct++;
                }
            }
        }

        double accuracy = (double) correct / nSamples;

        // Calculate macro precision, recall, and F1 per class
        double sumPrecision = 0.0;
        double sumRecall = 0.0;
        double sumF1 = 0.0;
        Map<String, Double> classF1 = new LinkedHashMap<>();
        int evaluatedClasses = 0;

        for (int k = 0; k < numClasses; k++) {
            int tp = confusionMatrix[k][k];
            int fn = 0;
            int fp = 0;

            for (int j = 0; j < numClasses; j++) {
                if (j != k) {
                    fn += confusionMatrix[k][j];
                    fp += confusionMatrix[j][k];
                }
            }

            double precision = (tp + fp) == 0 ? 0.0 : (double) tp / (tp + fp);
            double recall = (tp + fn) == 0 ? 0.0 : (double) tp / (tp + fn);
            double f1 = (precision + recall) == 0.0 ? 0.0 : 2.0 * (precision * recall) / (precision + recall);

            classF1.put(classes.get(k), f1);
            sumPrecision += precision;
            sumRecall += recall;
            sumF1 += f1;
            evaluatedClasses++;
        }

        double macroPrecision = sumPrecision / evaluatedClasses;
        double macroRecall = sumRecall / evaluatedClasses;
        double macroF1 = sumF1 / evaluatedClasses;

        return new ModelMetrics(accuracy, macroPrecision, macroRecall, macroF1, nSamples, classF1);
    }

    public List<String> getClasses() {
        return classes;
    }
}
