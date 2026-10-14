package com.milly.backend.ai.nlp;

import java.io.Serializable;
import java.util.*;

/**
 * TF-IDF (Term Frequency - Inverse Document Frequency) Vectorizer in Java.
 * Implements standard smooth IDF: idf(t) = ln((1 + N) / (1 + df(t))) + 1
 * Applies L2-normalization on resulting vectors for accurate cosine similarity and linear classification.
 */
public class TfidfVectorizer implements Serializable {

    private static final long serialVersionUID = 1L;

    private Map<String, Integer> vocabulary = new HashMap<>();
    private List<String> indexToWord = new ArrayList<>();
    private double[] idf;
    private int documentCount = 0;
    private final boolean useBigrams;
    private final int minDocFreq;

    public TfidfVectorizer() {
        this(true, 1);
    }

    public TfidfVectorizer(boolean useBigrams, int minDocFreq) {
        this.useBigrams = useBigrams;
        this.minDocFreq = minDocFreq;
    }

    /**
     * Learns vocabulary and IDF weights from training documents.
     */
    public void fit(List<String> documents) {
        this.documentCount = documents.size();
        Map<String, Integer> docFreq = new HashMap<>();

        // Count document frequency for each unique term per document
        for (String doc : documents) {
            List<String> tokens = useBigrams ? Tokenizer.tokenizeWithBigrams(doc) : Tokenizer.tokenize(doc);
            Set<String> uniqueTokens = new HashSet<>(tokens);
            for (String token : uniqueTokens) {
                docFreq.put(token, docFreq.getOrDefault(token, 0) + 1);
            }
        }

        // Build sorted vocabulary filtered by minimum document frequency
        vocabulary.clear();
        indexToWord.clear();
        int idx = 0;
        for (Map.Entry<String, Integer> entry : docFreq.entrySet()) {
            if (entry.getValue() >= minDocFreq) {
                vocabulary.put(entry.getKey(), idx++);
                indexToWord.add(entry.getKey());
            }
        }

        // Calculate smooth IDF: idf(t) = ln((1 + N) / (1 + df(t))) + 1
        int vocabSize = vocabulary.size();
        idf = new double[vocabSize];
        for (Map.Entry<String, Integer> entry : vocabulary.entrySet()) {
            String term = entry.getKey();
            int termIdx = entry.getValue();
            int df = docFreq.get(term);
            idf[termIdx] = Math.log((1.0 + documentCount) / (1.0 + df)) + 1.0;
        }
    }

    /**
     * Transforms a single document into an L2-normalized TF-IDF feature vector.
     */
    public double[] transform(String document) {
        int vocabSize = vocabulary.size();
        double[] vector = new double[vocabSize];
        if (vocabSize == 0 || document == null) {
            return vector;
        }

        List<String> tokens = useBigrams ? Tokenizer.tokenizeWithBigrams(document) : Tokenizer.tokenize(document);
        if (tokens.isEmpty()) {
            return vector;
        }

        // Term frequency counts
        Map<String, Integer> tf = new HashMap<>();
        for (String token : tokens) {
            tf.put(token, tf.getOrDefault(token, 0) + 1);
        }

        double docLen = tokens.size();
        for (Map.Entry<String, Integer> entry : tf.entrySet()) {
            String term = entry.getKey();
            Integer termIdx = vocabulary.get(term);
            if (termIdx != null) {
                // Sublinear / Normalized TF * IDF
                double termFrequency = entry.getValue() / docLen;
                vector[termIdx] = termFrequency * idf[termIdx];
            }
        }

        // L2 Normalization: v = v / sqrt(sum(v_i^2))
        double sumSq = 0.0;
        for (double v : vector) {
            sumSq += v * v;
        }

        if (sumSq > 0.0) {
            double norm = Math.sqrt(sumSq);
            for (int i = 0; i < vector.length; i++) {
                vector[i] /= norm;
            }
        }

        return vector;
    }

    /**
     * Transforms an entire list of documents.
     */
    public double[][] transformCorpus(List<String> documents) {
        double[][] matrix = new double[documents.size()][];
        for (int i = 0; i < documents.size(); i++) {
            matrix[i] = transform(documents.get(i));
        }
        return matrix;
    }

    /**
     * Computes cosine similarity between two normalized vectors: dot product.
     */
    public static double cosineSimilarity(double[] v1, double[] v2) {
        if (v1 == null || v2 == null || v1.length != v2.length) {
            return 0.0;
        }
        double dot = 0.0;
        for (int i = 0; i < v1.length; i++) {
            dot += v1[i] * v2[i];
        }
        return Math.max(0.0, Math.min(1.0, dot));
    }

    public int getVocabSize() {
        return vocabulary.size();
    }

    public Map<String, Integer> getVocabulary() {
        return vocabulary;
    }

    public List<String> getIndexToWord() {
        return indexToWord;
    }
}
