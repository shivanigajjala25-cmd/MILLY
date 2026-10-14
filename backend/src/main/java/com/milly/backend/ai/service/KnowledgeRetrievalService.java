package com.milly.backend.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.milly.backend.ai.model.KnowledgeArticle;
import com.milly.backend.ai.nlp.TfidfVectorizer;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

/**
 * Knowledge Retrieval System using TF-IDF and Cosine Similarity.
 * RAG-style retriever that searches curated PTSD educational base.
 */
@Service
public class KnowledgeRetrievalService {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeRetrievalService.class);

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final TfidfVectorizer vectorizer = new TfidfVectorizer(true, 1);

    private List<KnowledgeArticle> articles = new ArrayList<>();
    private double[][] articleVectors;
    private boolean isReady = false;

    @PostConstruct
    public void init() {
        loadKnowledgeBase();
    }

    public synchronized void loadKnowledgeBase() {
        try {
            log.info("Loading PTSD Knowledge Base from knowledge_base.json...");
            ClassPathResource resource = new ClassPathResource("data/knowledge_base.json");
            try (InputStream is = resource.getInputStream()) {
                this.articles = objectMapper.readValue(is, new TypeReference<List<KnowledgeArticle>>() {});
            }

            if (articles.isEmpty()) {
                log.warn("Knowledge base is empty!");
                return;
            }

            // Create indexable document corpus combining title, keywords, summary, and content
            List<String> documents = new ArrayList<>();
            for (KnowledgeArticle article : articles) {
                StringBuilder doc = new StringBuilder();
                doc.append(article.getTitle()).append(" ");
                if (article.getKeywords() != null) {
                    doc.append(String.join(" ", article.getKeywords())).append(" ");
                }
                doc.append(article.getSummary()).append(" ");
                doc.append(article.getContent());
                documents.add(doc.toString());
            }

            // Fit vectorizer on knowledge base documents
            vectorizer.fit(documents);
            articleVectors = vectorizer.transformCorpus(documents);
            isReady = true;

            log.info("Successfully indexed {} PTSD knowledge articles with vocabulary size {}",
                    articles.size(), vectorizer.getVocabSize());

        } catch (Exception e) {
            log.error("Failed to load Knowledge Base: {}", e.getMessage(), e);
        }
    }

    /**
     * Retrieves the top K most relevant articles using cosine similarity.
     */
    public List<KnowledgeArticle> retrieveRelevant(String query, int topK) {
        if (!isReady || query == null || query.trim().isEmpty() || articles.isEmpty()) {
            return Collections.emptyList();
        }

        double[] queryVector = vectorizer.transform(query);

        List<ScoredArticle> scored = new ArrayList<>();
        for (int i = 0; i < articles.size(); i++) {
            double sim = TfidfVectorizer.cosineSimilarity(queryVector, articleVectors[i]);
            // Boost match if keywords directly match words in query
            double keywordBoost = calculateKeywordBoost(query, articles.get(i));
            double totalScore = sim * 0.7 + keywordBoost * 0.3;

            scored.add(new ScoredArticle(articles.get(i), totalScore));
        }

        // Sort descending by score
        scored.sort((a, b) -> Double.compare(b.score, a.score));

        List<KnowledgeArticle> results = new ArrayList<>();
        for (int i = 0; i < Math.min(topK, scored.size()); i++) {
            KnowledgeArticle original = scored.get(i).article;
            // Create shallow copy to set relevance score
            KnowledgeArticle copy = new KnowledgeArticle();
            copy.setId(original.getId());
            copy.setTitle(original.getTitle());
            copy.setCategory(original.getCategory());
            copy.setKeywords(original.getKeywords());
            copy.setSummary(original.getSummary());
            copy.setContent(original.getContent());
            copy.setCopingTechnique(original.getCopingTechnique());
            copy.setRelevanceScore(scored.get(i).score);
            results.add(copy);
        }

        return results;
    }

    private double calculateKeywordBoost(String query, KnowledgeArticle article) {
        if (article.getKeywords() == null || article.getKeywords().isEmpty()) {
            return 0.0;
        }
        String q = query.toLowerCase();
        int matches = 0;
        for (String kw : article.getKeywords()) {
            if (q.contains(kw.toLowerCase())) {
                matches++;
            }
        }
        return Math.min(1.0, (double) matches / Math.min(3, article.getKeywords().size()));
    }

    private static class ScoredArticle {
        final KnowledgeArticle article;
        final double score;

        ScoredArticle(KnowledgeArticle article, double score) {
            this.article = article;
            this.score = score;
        }
    }

    public List<KnowledgeArticle> getAllArticles() {
        return articles;
    }
}
