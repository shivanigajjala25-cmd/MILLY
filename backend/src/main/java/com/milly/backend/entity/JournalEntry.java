package com.milly.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * STRICTLY PRIVATE JOURNAL ENTRY.
 * The AI Chat system does NOT query, read, or process this entity.
 */
@Entity
@Table(name = "journal_entries")
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId = 1L;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    private String moodTag;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JournalEntry() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public JournalEntry(String title, String content, String moodTag) {
        this();
        this.title = title;
        this.content = content;
        this.moodTag = moodTag;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMoodTag() {
        return moodTag;
    }

    public void setMoodTag(String moodTag) {
        this.moodTag = moodTag;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
