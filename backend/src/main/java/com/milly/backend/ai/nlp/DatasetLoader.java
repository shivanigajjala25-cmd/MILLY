package com.milly.backend.ai.nlp;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Utility to parse CSV datasets with quote support.
 */
public class DatasetLoader {

    public static class Sample {
        public final String text;
        public final String label;

        public Sample(String text, String label) {
            this.text = text;
            this.label = label;
        }
    }

    public static List<Sample> loadCsvFromStream(InputStream inputStream) {
        List<Sample> samples = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String line;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                // Parse CSV with quoted text e.g. "I can't breathe",panic
                String text;
                String label;
                if (line.startsWith("\"")) {
                    int lastQuote = line.lastIndexOf("\"");
                    if (lastQuote > 0 && lastQuote < line.length() - 1) {
                        text = line.substring(1, lastQuote).replace("\"\"", "\"");
                        String remainder = line.substring(lastQuote + 1);
                        int commaIdx = remainder.indexOf(",");
                        if (commaIdx != -1) {
                            label = remainder.substring(commaIdx + 1).trim();
                        } else {
                            label = remainder.trim();
                        }
                    } else {
                        continue;
                    }
                } else {
                    int commaIdx = line.lastIndexOf(",");
                    if (commaIdx != -1) {
                        text = line.substring(0, commaIdx).trim();
                        label = line.substring(commaIdx + 1).trim();
                    } else {
                        continue;
                    }
                }

                if (!text.isEmpty() && !label.isEmpty()) {
                    samples.add(new Sample(text, label));
                }
            }
        } catch (Exception e) {
            System.err.println("Error reading CSV dataset: " + e.getMessage());
        }
        return samples;
    }
}
