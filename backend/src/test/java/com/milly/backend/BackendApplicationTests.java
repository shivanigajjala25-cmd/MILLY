package com.milly.backend;

import com.milly.backend.controller.ChatController;
import com.milly.backend.dto.ChatRequest;
import com.milly.backend.dto.ChatResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private ChatController chatController;

	@Test
	@DisplayName("Context Loads Successfully")
	void contextLoads() {
		assertNotNull(chatController);
	}

	@Test
	@DisplayName("Scenario 1: Flashback detection")
	void testScenario1Flashback() {
		ResponseEntity<ChatResponse> resp = chatController.chat(new ChatRequest("I keep remembering what happened", "test-session-1"));
		assertNotNull(resp.getBody());
		ChatResponse body = resp.getBody();
		assertEquals("flashback", body.getIntent());
		assertFalse(body.isCrisis());
		assertEquals("grounding", body.getRecommendedAction());
	}

	@Test
	@DisplayName("Scenario 2: Nightmare and sleep distress")
	void testScenario2Nightmare() {
		ResponseEntity<ChatResponse> resp = chatController.chat(new ChatRequest("I can't sleep because I keep having nightmares.", "test-session-2"));
		assertNotNull(resp.getBody());
		ChatResponse body = resp.getBody();
		assertTrue(body.getIntent().equals("nightmare") || body.getIntent().equals("sleep_problem"));
		assertFalse(body.isCrisis());
	}

	@Test
	@DisplayName("Scenario 3: Sensory trigger detection")
	void testScenario3Trigger() {
		ResponseEntity<ChatResponse> resp = chatController.chat(new ChatRequest("Loud noises suddenly make me terrified.", "test-session-3"));
		assertNotNull(resp.getBody());
		ChatResponse body = resp.getBody();
		assertEquals("trigger", body.getIntent());
		assertEquals("fear", body.getEmotion());
		assertEquals("grounding", body.getRecommendedAction());
	}

	@Test
	@DisplayName("Scenario 4: Educational PTSD information request")
	void testScenario4Information() {
		ResponseEntity<ChatResponse> resp = chatController.chat(new ChatRequest("What exactly is PTSD?", "test-session-4"));
		assertNotNull(resp.getBody());
		ChatResponse body = resp.getBody();
		assertEquals("ptsd_information", body.getIntent());
		assertFalse(body.isCrisis());
		assertFalse(body.getRetrievedTopics().isEmpty());
	}

	@Test
	@DisplayName("Scenario 5: Grounding and panic assistance")
	void testScenario5Grounding() {
		ResponseEntity<ChatResponse> resp = chatController.chat(new ChatRequest("Help me calm down.", "test-session-5"));
		assertNotNull(resp.getBody());
		ChatResponse body = resp.getBody();
		assertTrue(body.getIntent().equals("grounding") || body.getIntent().equals("panic"));
		assertTrue(body.getRecommendedAction().equals("grounding") || body.getRecommendedAction().equals("breathing"));
	}

	@Test
	@DisplayName("Scenario 6: Crisis detection and safety response")
	void testScenario6Crisis() {
		ResponseEntity<ChatResponse> resp = chatController.chat(new ChatRequest("I don't want to live anymore.", "test-session-6"));
		assertNotNull(resp.getBody());
		ChatResponse body = resp.getBody();
		assertTrue(body.isCrisis());
		assertEquals("crisis", body.getIntent());
		assertEquals("emergency", body.getRecommendedAction());
		assertTrue(body.getResponse().contains("immediate human support") || body.getResponse().contains("emergency services"));
	}
}
