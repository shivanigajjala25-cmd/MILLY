
package com.milly.backend.ai.service;

import com.milly.backend.ai.model.KnowledgeArticle;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ResponseEngineService {

    public static class GeneratedResponse {
        private final String text;
        private final String recommendedAction;
        private final List<String> retrievedTopicTitles;

        public GeneratedResponse(
                String text,
                String recommendedAction,
                List<String> retrievedTopicTitles) {
            this.text = text;
            this.recommendedAction = recommendedAction;
            this.retrievedTopicTitles = retrievedTopicTitles;
        }

        public String getText() {
            return text;
        }

        public String getRecommendedAction() {
            return recommendedAction;
        }

        public List<String> getRetrievedTopicTitles() {
            return retrievedTopicTitles;
        }
    }

    public static class MessageContext {
        public final String role;
        public final String text;
        public final String intent;

        public MessageContext(String role, String text, String intent) {
            this.role = role;
            this.text = text;
            this.intent = intent;
        }
    }

    private final Map<String, LinkedList<MessageContext>> sessionContextMap =
            new ConcurrentHashMap<>();

    public GeneratedResponse generateResponse(
            String sessionId,
            String userMessage,
            String intent,
            String emotion,
            List<KnowledgeArticle> retrievedKnowledge,
            String wellnessContext) {

        String key = (sessionId == null || sessionId.trim().isEmpty())
                ? "default" : sessionId;

        LinkedList<MessageContext> history =
                sessionContextMap.computeIfAbsent(key, k -> new LinkedList<>());

        synchronized (history) {
            String text = userMessage == null ? "" : userMessage.trim();
            String effectiveIntent = chooseIntent(text, intent, history);

            List<String> topicTitles = new ArrayList<>();
            if (retrievedKnowledge != null) {
                for (KnowledgeArticle article : retrievedKnowledge) {
                    if (article != null && article.getTitle() != null) {
                        topicTitles.add(article.getTitle());
                    }
                }
            }

            String response = createNaturalResponse(
                    text, effectiveIntent, history);

            if (wellnessContext != null
                    && !wellnessContext.trim().isEmpty()) {
                response += "\n\n" + wellnessContext.trim();
            }

            history.addLast(new MessageContext("user", text, effectiveIntent));
            history.addLast(new MessageContext("milly", response, effectiveIntent));

            while (history.size() > 12) {
                history.removeFirst();
            }

            return new GeneratedResponse(
                    response, getRecommendedAction(effectiveIntent), topicTitles);
        }
    }

    /*
     * Correct obvious everyday conversational messages when the ML
     * classifier predicts an unrelated intent, such as goodbye.
     */
    private String chooseIntent(
            String text,
            String classifiedIntent,
            LinkedList<MessageContext> history) {

        String t = text.toLowerCase(Locale.ROOT);
        String predicted = classifiedIntent == null
                ? "default" : classifiedIntent.toLowerCase(Locale.ROOT);

        if (isFarewell(t)) {
            return "goodbye";
        }

        if (containsAny(t,
                "things don't work out for me",
                "things never work out",
                "nothing works out",
                "everything goes wrong",
                "i feel like a failure",
                "i feel like i can't do anything right",
                "i feel like a burden",
                "i feel stuck",
                "i feel left out",
                "i feel lonely",
                "i feel misunderstood",
                "i feel discouraged",
                "i feel hopeless")) {
            return "emotional_distress";
        }

        if (containsAny(t,
                "a little anxious", "slightly anxious",
                "feeling anxious", "feel anxious",
                "i am anxious", "i'm anxious",
                "feeling nervous", "i feel nervous",
                "i am worried", "i'm worried",
                "feeling uneasy", "i feel uneasy")) {
            return "anxiety";
        }

        if (containsAny(t,
                "difficult day", "rough day",
                "bad day", "feeling down",
                "feeling low", "not feeling great",
                "not doing well", "had a hard day",
                "i feel sad", "i'm sad")) {
            return "emotional_distress";
        }

        // Keep a relevant previous topic for short follow-up answers.
        if (!history.isEmpty()) {
            MessageContext previous = history.getLast();

            if (previous != null
                    && "milly".equals(previous.role)
                    && "sleep_problem".equals(previous.intent)
                    && isDurationOrDetailResponse(t)) {
                return "sleep_problem";
            }
        }

        return predicted;
    }

    private String createNaturalResponse(
            String text,
            String intent,
            LinkedList<MessageContext> history) {

        int turn = history.size() / 2;

        switch (intent) {
            case "greeting":
                return choose(turn,
                        "Hey! What's up?",
                        "Hi :) How's your day going?",
                        "Hey, I'm listening. What's on your mind?");

            case "anxiety":
                return choose(turn,
                        "Hmm, is there something specific on your mind, or is it just that uneasy feeling?",
                        "I get that. Did something set it off, or has it been there for a while?",
                        "That can be an uncomfortable feeling. Do you know what's making you anxious, or are you not quite sure yet?");

            case "emotional_distress":
                if (containsAny(text.toLowerCase(Locale.ROOT),
                        "things don't work out", "things never work out",
                        "nothing works out", "everything goes wrong",
                        "failure", "can't do anything right",
                        "burden", "discouraged", "hopeless")) {
                    return choose(turn,
                            "That sounds really discouraging. Did something happen, or has it been building up for a while?",
                            "It's exhausting when it feels like nothing is going your way. Has something in particular been bothering you?",
                            "I can see why that would get to you. Do you want to tell me what brought that feeling on?");
                }

                if (containsAny(text.toLowerCase(Locale.ROOT),
                        "difficult day", "rough day", "bad day",
                        "hard day", "not doing well")) {
                    return choose(turn,
                            "Oh, I'm sorry it's been that kind of day. What happened?",
                            "Sounds like today hasn't been easy. Want to talk about it?",
                            "Ah, one of those days? What's been going on?");
                }

                return choose(turn,
                        "What's been on your mind lately?",
                        "Do you want to tell me a little about what's been going on?",
                        "I'm listening. Where would you like to start?");

            case "panic":
                return choose(turn,
                        "That sounds really uncomfortable. What are you noticing right now?",
                        "I'm sorry this is happening. Would it help to talk through what's going on, or would you rather try something grounding?",
                        "Let's take this one step at a time. What feels most difficult at the moment?");

            case "flashback":
                return choose(turn,
                        "That sounds unsettling. Would it help to focus on what's around you right now, or would you rather tell me what you're experiencing?",
                        "I'm sorry you're going through that. We can take this slowly. What would feel helpful right now?",
                        "That can be a lot to deal with. We don't have to go into the memory itself. Would grounding help?");

            case "trigger":
                return choose(turn,
                        "Did something just bring up a difficult feeling?",
                        "Sometimes a moment can affect us more than we expect. Do you want to talk about what happened?",
                        "You don't have to explain anything you're not comfortable sharing. What would help right now?");

            case "nightmare":
                return choose(turn,
                        "Oh, that sounds like a rough night. How are you feeling now?",
                        "I'm sorry. Waking up from a difficult dream can leave you feeling unsettled. Are you feeling a little more settled now?",
                        "That doesn't sound pleasant. Do you want to talk about how you're feeling, without going into the dream itself?");

            case "sleep_problem":
                return choose(turn,
                        "Sleep has been difficult? Has this been happening often, or was last night particularly rough?",
                        "That sounds tiring. Is it hard to fall asleep, or do you keep waking up?",
                        "Not getting proper rest can make everything harder. What's been happening with your sleep?");

            case "ptsd_information":
                return "PTSD is a condition that can develop after experiencing or witnessing a traumatic event. It can affect mood, sleep, memories and how safe someone feels. Having one symptom doesn't automatically mean someone has PTSD. Is there a particular part you'd like to understand?";

            case "grounding":
                return choose(turn,
                        "Of course. Would you like to try a grounding exercise together?",
                        "We can do that. Would you prefer a quick senses exercise or a simple breathing exercise?",
                        "Let's make this simple. Notice one thing you can see around you. Want me to guide you through the rest?");

            case "coping":
                return choose(turn,
                        "We can figure something out together. What's been the hardest part to deal with lately?",
                        "There are a few things we could try, but it depends on what you're dealing with. What's going on?",
                        "Would you prefer a practical suggestion, or would you rather talk it through first?");

            case "professional_help":
                return "Talking to a qualified mental-health professional can be a helpful step, especially if this is affecting everyday life. You don't have to figure out how to start all at once. Would you like help thinking through what to say or how to find support?";

            case "gratitude":
                return choose(turn,
                        "Of course :)",
                        "Anytime. I'm glad it helped a little.",
                        "You're welcome. What else is on your mind?");

            case "goodbye":
                return choose(turn,
                        "Okay, take care. You can come back whenever you feel like talking.",
                        "See you later. Be kind to yourself.",
                        "Alright. Take care of yourself, okay?");

            default:
                return choose(turn,
                        "Oh, tell me more.",
                        "What happened?",
                        "How has that been for you?",
                        "I want to understand. What do you mean?",
                        "Hmm. What part of it has been bothering you most?");
        }
    }

    private String getRecommendedAction(String intent) {
        switch (intent) {
            case "panic":
                return "breathing";
            case "anxiety":
                return "grounding";
            case "flashback":
            case "trigger":
            case "nightmare":
            case "grounding":
                return "grounding";
            case "sleep_problem":
                return "calm_mode";
            case "coping":
                return "none";
            default:
                return "none";
        }
    }

    private boolean isFarewell(String text) {
        return text.matches(".*\\b(bye|goodbye|good bye|see you|talk later|gotta go)\\b.*")
                || text.matches("^(thanks,? bye|okay bye|ok bye)[.! ]*$");
    }

    private boolean isDurationOrDetailResponse(String text) {
        return text.matches(".*\\b(days?|weeks?|months?|years?|tonight|last night|yesterday|every night|often|sometimes|lately)\\b.*")
                || text.matches(".*\\b(one|two|three|four|five|few|several)\\b.*");
    }

    private boolean containsAny(String text, String... phrases) {
        for (String phrase : phrases) {
            if (text.contains(phrase)) {
                return true;
            }
        }
        return false;
    }

    private String choose(int turn, String... options) {
        return options[Math.floorMod(turn, options.length)];
    }

    public void clearSession(String sessionId) {
        if (sessionId != null) {
            sessionContextMap.remove(sessionId);
        }
    }
}
