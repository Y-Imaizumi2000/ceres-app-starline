package com.starline.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "today_space_histories")
public class TodaySpaceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_date", nullable = false, unique = true)
    private LocalDate eventDate;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, length = 3000)
    private String description;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(nullable = false, length = 200)
    private String source;

    protected TodaySpaceHistory() {
    }

    public TodaySpaceHistory(LocalDate eventDate, String title, String description, String imageUrl, String source) {
        this.eventDate = eventDate;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.source = source;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getSource() {
        return source;
    }

    public void replaceContent(String title, String description, String imageUrl, String source) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.source = source;
    }
}
