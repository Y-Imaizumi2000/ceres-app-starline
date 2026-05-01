package com.starline.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "today_space_images")
public class TodaySpaceImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_date", nullable = false, unique = true)
    private LocalDate imageDate;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(name = "media_type", nullable = false, length = 50)
    private String mediaType;

    @Column(nullable = false, length = 200)
    private String source;

    protected TodaySpaceImage() {
    }

    public TodaySpaceImage(
            LocalDate imageDate,
            String title,
            String description,
            String imageUrl,
            String mediaType,
            String source
    ) {
        this.imageDate = imageDate;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.mediaType = mediaType;
        this.source = source;
    }

    public LocalDate getImageDate() {
        return imageDate;
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

    public String getMediaType() {
        return mediaType;
    }

    public String getSource() {
        return source;
    }

    public void replaceContent(String title, String description, String imageUrl, String mediaType, String source) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.mediaType = mediaType;
        this.source = source;
    }
}
