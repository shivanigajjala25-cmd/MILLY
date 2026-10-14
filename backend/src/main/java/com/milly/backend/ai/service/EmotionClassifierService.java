package com.milly.backend.ai.service;

import com.milly.backend.ai.model.ModelMetrics;
import com.milly.backend.ai.nlp.ClassificationResult;
import com.milly.backend.ai.nlp.DatasetLoader;
import com.milly.backend.ai.nlp.LogisticRegressionClassifier;
import com.milly.backend.ai.nlp.TfidfVectorizer;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

/**
 * Supervised Emotion Classifier Service.
 * Detects emotional states: fear, anxiety, sadness, anger, calm, neutral, distress.
 */
@Service
public class EmotionClassifierService {

    private static final Logger log = LoggerFactory.getLogger(EmotionClassifierService.class);

    private final TfidfVectorizer vectorizer = new TfidfVectorizer(true, 1);
    private final LogisticRegressionClassifier classifier = new LogisticRegressionClassifier(1.2, 0.00005, 400);

    private ModelMetrics evaluationMetrics;
    private boolean isReady = false;

    @PostConstruct
    public void init() {
        trainModel();
    }

    public synchronized void trainModel() {
        try {
            log.info("Starting Emotion Classifier training...");
            ClassPathResource resource = new ClassPathResource("data/emotions.csv");
            List<DatasetLoader.Sample> samples;
            try (InputStream is = resource.getInputStream()) {
                samples = DatasetLoader.loadCsvFromStream(is);
            }

            if (samples.isEmpty()) {
                log.warn("No emotion samples found in emotions.csv!");
                return;
            }

            // Shuffle with fixed seed
            List<DatasetLoader.Sample> shuffled = new ArrayList<>(samples);
            Collections.shuffle(shuffled, new Random(42));

            int total = shuffled.size();
            int trainSize = (int) (total * 0.8);

            List<String> trainTexts = new ArrayList<>();
            List<String> trainLabels = new ArrayList<>();
            List<String> testTexts = new ArrayList<>();
            List<String> testLabels = new ArrayList<>();

            for (int i = 0; i < total; i++) {
                if (i < trainSize) {
                    trainTexts.add(shuffled.get(i).text);
                    trainLabels.add(shuffled.get(i).label);
                } else {
                    testTexts.add(shuffled.get(i).text);
                    testLabels.add(shuffled.get(i).label);
                }
            }

            // 1. Fit TF-IDF
            List<String> allTexts = new ArrayList<>();
            List<String> allLabels = new ArrayList<>();
            for (DatasetLoader.Sample s : samples) {
                allTexts.add(s.text);
                allLabels.add(s.label);
            }
            vectorizer.fit(allTexts);

            // 2. Vectorize for evaluation split
            double[][] X_train = vectorizer.transformCorpus(trainTexts);
            double[][] X_test = vectorizer.transformCorpus(testTexts);

            // 3. Train on training split and compute evaluation metrics
            LogisticRegressionClassifier evalModel = new LogisticRegressionClassifier(1.2, 0.00005, 400);
            evalModel.train(X_train, trainLabels);
            this.evaluationMetrics = evalModel.evaluate(X_test, testLabels);

            // 4. Train production model on 100% of labeled domain dataset
            double[][] X_all = vectorizer.transformCorpus(allTexts);
            classifier.train(X_all, allLabels);

            isReady = true;
            log.info("=================================================");
            log.info("  EMOTION CLASSIFIER MODEL EVALUATION RESULTS   ");
            log.info("=================================================");
            log.info("Total samples: {}, Train split: {}, Test split: {}", total, trainSize, total - trainSize);
            log.info("Accuracy:  {}/100% ({})", String.format("%.2f", evaluationMetrics.getAccuracy() * 100), String.format("%.4f", evaluationMetrics.getAccuracy()));
            log.info("Precision: {}", String.format("%.4f", evaluationMetrics.getPrecision()));
            log.info("Recall:    {}", String.format("%.4f", evaluationMetrics.getRecall()));
            log.info("F1 Score:  {}", String.format("%.4f", evaluationMetrics.getF1Score()));
            log.info("=================================================");

        } catch (Exception e) {
            log.error("Failed to train Emotion Classifier: {}", e.getMessage(), e);
        }
    }

    public ClassificationResult classify(String text) {
        if (!isReady) {
            return new ClassificationResult("neutral", 0.5, Collections.emptyMap());
        }
        double[] vector = vectorizer.transform(text);
        return classifier.predict(vector);
    }

    public ModelMetrics getEvaluationMetrics() {
        return evaluationMetrics;
    }

    public boolean isReady() {
        return isReady;
    }
}
