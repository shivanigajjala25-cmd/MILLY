package com.milly.backend.config;

import com.milly.backend.entity.Checkin;
import com.milly.backend.entity.GroundingSession;
import com.milly.backend.entity.JournalEntry;
import com.milly.backend.entity.User;
import com.milly.backend.repository.CheckinRepository;
import com.milly.backend.repository.GroundingSessionRepository;
import com.milly.backend.repository.JournalEntryRepository;
import com.milly.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner seedDemoData(
            UserRepository userRepository,
            CheckinRepository checkinRepository,
            JournalEntryRepository journalRepository,
            GroundingSessionRepository groundingRepository) {
        return args -> {
            // Seed Demo User if not present
            if (userRepository.count() == 0) {
                User demoUser = new User("demo_user", "1234");
                userRepository.save(demoUser);
                log.info("Initialized demo user with default PIN '1234'");
            }

            // Seed initial check-ins for rich dashboard visualization
            if (checkinRepository.count() == 0) {
                LocalDateTime now = LocalDateTime.now();

                Checkin c1 = new Checkin("Fearful", 8, 4.5, true, true, "Loud noises, Crowded store");
                c1.setCreatedAt(now.minusDays(6));
                checkinRepository.save(c1);

                Checkin c2 = new Checkin("Anxious", 7, 5.0, true, false, "Work deadline");
                c2.setCreatedAt(now.minusDays(5));
                checkinRepository.save(c2);

                Checkin c3 = new Checkin("Sad", 6, 6.0, false, false, "Trauma anniversary");
                c3.setCreatedAt(now.minusDays(4));
                checkinRepository.save(c3);

                Checkin c4 = new Checkin("Okay", 5, 6.5, false, false, "None");
                c4.setCreatedAt(now.minusDays(3));
                checkinRepository.save(c4);

                Checkin c5 = new Checkin("Anxious", 6, 5.5, true, false, "Sirens outside");
                c5.setCreatedAt(now.minusDays(2));
                checkinRepository.save(c5);

                Checkin c6 = new Checkin("Calm", 3, 7.5, false, false, "None");
                c6.setCreatedAt(now.minusDays(1));
                checkinRepository.save(c6);

                Checkin c7 = new Checkin("Calm", 4, 7.0, false, false, "Gentle morning");
                c7.setCreatedAt(now);
                checkinRepository.save(c7);

                log.info("Seeded 7 demo wellness check-ins for weekly dashboard charts.");
            }

            // Seed demo grounding sessions
            if (groundingRepository.count() == 0) {
                groundingRepository.save(new GroundingSession("5-4-3-2-1", 180));
                groundingRepository.save(new GroundingSession("box_breathing", 120));
                groundingRepository.save(new GroundingSession("safe_place", 150));
                log.info("Seeded demo grounding sessions.");
            }

            // Seed demo private journal note
            if (journalRepository.count() == 0) {
                JournalEntry j1 = new JournalEntry(
                        "Reflections on grounding today",
                        "Practiced the 5-4-3-2-1 exercise when I felt overwhelmed this afternoon. Focusing on touching the wood desk and hearing the rain outside helped bring my heart rate back to normal.",
                        "Reflective"
                );
                journalRepository.save(j1);
                log.info("Seeded demo private journal entry (protected by PIN 1234).");
            }
        };
    }
}
