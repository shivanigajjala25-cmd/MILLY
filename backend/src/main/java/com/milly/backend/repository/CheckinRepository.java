package com.milly.backend.repository;

import com.milly.backend.entity.Checkin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckinRepository extends JpaRepository<Checkin, Long> {
    List<Checkin> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Checkin> findTop7ByUserIdOrderByCreatedAtDesc(Long userId);
}
