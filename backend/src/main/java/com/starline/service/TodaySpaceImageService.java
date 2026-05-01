package com.starline.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.starline.dto.response.TodaySpaceImageResponse;
import com.starline.entity.TodaySpaceImage;
import com.starline.repository.TodaySpaceImageRepository;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class TodaySpaceImageService {

    private final TodaySpaceImageRepository todaySpaceImageRepository;
    private final RestClient restClient;
    private final String apiKey;

    public TodaySpaceImageService(
            TodaySpaceImageRepository todaySpaceImageRepository,
            @Value("${external.nasa.base-url:https://api.nasa.gov}") String nasaBaseUrl,
            @Value("${external.nasa.api-key:DEMO_KEY}") String apiKey
    ) {
        this.todaySpaceImageRepository = todaySpaceImageRepository;
        this.restClient = RestClient.builder().baseUrl(nasaBaseUrl).build();
        this.apiKey = apiKey;
    }

    @Transactional
    public TodaySpaceImageResponse getTodaySpaceImage() {
        LocalDate today = LocalDate.now();
        TodaySpaceImage fetched = fetchFromNasa(today);
        return todaySpaceImageRepository.findByImageDate(today)
                .map(existing -> {
                    if (!"NASA APOD".equals(existing.getSource()) && "NASA APOD".equals(fetched.getSource())) {
                        existing.replaceContent(
                                fetched.getTitle(),
                                fetched.getDescription(),
                                fetched.getImageUrl(),
                                fetched.getMediaType(),
                                fetched.getSource()
                        );
                    }
                    return toResponse(existing);
                })
                .orElseGet(() -> toResponse(todaySpaceImageRepository.save(fetched)));
    }

    private TodaySpaceImage fetchFromNasa(LocalDate today) {
        TodaySpaceImage todayImage = fetchApodForDate(today, today);
        if (todayImage != null) {
            return todayImage;
        }
        TodaySpaceImage recentImage = fetchApodForDate(today, today.minusDays(1));
        if (recentImage != null) {
            return recentImage;
        }
        return fallback(today);
    }

    private TodaySpaceImage fetchApodForDate(LocalDate cacheDate, LocalDate apodDate) {
        try {
            ApodResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/planetary/apod")
                            .queryParam("api_key", apiKey)
                            .queryParam("date", apodDate)
                            .build())
                    .retrieve()
                    .body(ApodResponse.class);

            if (response == null || response.url() == null || response.url().isBlank()) {
                return null;
            }

            String title = response.title() == null || response.title().isBlank()
                    ? "NASA 今日の宇宙画像"
                    : response.title();
            String description = apodDate.equals(cacheDate)
                    ? "NASAが公開した今日の宇宙画像です。詳細な解説はNASA APODの元ページで確認できます。"
                    : "NASAの今日分がまだ未公開のため、直近で公開された宇宙画像を表示しています。";
            String mediaType = response.mediaType() == null || response.mediaType().isBlank()
                    ? "image"
                    : response.mediaType();
            return new TodaySpaceImage(cacheDate, title, description, response.url(), mediaType, "NASA APOD");
        } catch (RestClientException exception) {
            return null;
        }
    }

    private TodaySpaceImage fallback(LocalDate today) {
        return new TodaySpaceImage(
                today,
                "今日の宇宙画像",
                "NASA APODから画像を取得できませんでした。時間をおいてもう一度確認してみてください。",
                null,
                "text",
                "Starline"
        );
    }

    private TodaySpaceImageResponse toResponse(TodaySpaceImage entity) {
        return new TodaySpaceImageResponse(
                entity.getImageDate(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getImageUrl(),
                entity.getMediaType(),
                entity.getSource()
        );
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ApodResponse(
            @JsonProperty("date") LocalDate date,
            @JsonProperty("title") String title,
            @JsonProperty("explanation") String explanation,
            @JsonProperty("url") String url,
            @JsonProperty("media_type") String mediaType
    ) {
    }
}
