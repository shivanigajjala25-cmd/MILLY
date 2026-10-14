package com.milly.backend.ai.nlp;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Text Preprocessing and Tokenization for MILLY NLP Pipeline.
 * Handles lowercasing, punctuation removal, word boundary splitting,
 * stop word consideration, and unigram/bigram token extraction.
 */
public class Tokenizer {

    private static final Pattern PUNCTUATION_PATTERN = Pattern.compile("[^a-zA-Z0-9\\s]");
    private static final Pattern WHITESPACE_PATTERN = Pattern.compile("\\s+");

    // Standard English stop words (retaining emotionally relevant words like 'not', 'can', 'cant', 'no')
    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "about", "above", "after", "again", "all", "am", "an", "and", "any", "are", "as", "at",
            "be", "because", "been", "before", "being", "below", "between", "both", "by",
            "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further",
            "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his",
            "how", "i", "if", "in", "into", "is", "it", "its", "itself", "me", "more", "most", "my", "myself",
            "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
            "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves",
            "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
            "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with",
            "you", "your", "yours", "yourself", "yourselves"
    ));

    /**
     * Cleans and tokenizes input text into a list of words.
     */
    public static List<String> tokenize(String text) {
        if (text == null || text.trim().isEmpty()) {
            return Collections.emptyList();
        }

        // 1. Lowercase
        String cleaned = text.toLowerCase();

        // 2. Normalize contractions (e.g. can't -> cant, i'm -> im)
        cleaned = cleaned.replace("'", "").replace("’", "");

        // 3. Replace non-alphanumeric with spaces
        cleaned = PUNCTUATION_PATTERN.matcher(cleaned).replaceAll(" ");

        // 4. Split by whitespace
        String[] tokens = WHITESPACE_PATTERN.split(cleaned.trim());

        List<String> result = new ArrayList<>();
        for (String t : tokens) {
            String token = t.trim();
            if (token.length() > 1) { // keep words longer than 1 character
                result.add(token);
            }
        }
        return result;
    }

    /**
     * Tokenizes with both unigrams and bigrams for enhanced context capture.
     */
    public static List<String> tokenizeWithBigrams(String text) {
        List<String> unigrams = tokenize(text);
        if (unigrams.isEmpty()) {
            return unigrams;
        }

        List<String> tokens = new ArrayList<>(unigrams);
        for (int i = 0; i < unigrams.size() - 1; i++) {
            tokens.add(unigrams.get(i) + "_" + unigrams.get(i + 1));
        }
        return tokens;
    }

    public static boolean isStopWord(String word) {
        return STOP_WORDS.contains(word.toLowerCase());
    }
}
