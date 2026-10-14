package com.milly.backend.repository;

import com.milly.backend.entity.GroundingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroundingSessionRepository extends JpaRepository<GroundingSession, Long> {
    List<GroundingSession> findByUserIdOrderByCompletedAtDesc(Long userId);
    long countByUserId(Long userId);
}
