package com.starline.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.starline.dto.response.TodaySpaceHistoryResponse;
import com.starline.entity.TodaySpaceHistory;
import com.starline.repository.TodaySpaceHistoryRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class TodaySpaceHistoryService {

    private static final List<String> SPACE_KEYWORDS = List.of(
            "space", "nasa", "moon", "mars", "planet", "satellite", "astronaut", "cosmos", "orbit",
            "telescope", "rocket", "galaxy", "star", "solar", "lunar", "apollo"
    );

    private final TodaySpaceHistoryRepository todaySpaceHistoryRepository;
    private final RestClient restClient;

    public TodaySpaceHistoryService(
            TodaySpaceHistoryRepository todaySpaceHistoryRepository,
            @Value("${external.wikipedia.base-url:https://api.wikimedia.org}") String wikipediaBaseUrl
    ) {
        this.todaySpaceHistoryRepository = todaySpaceHistoryRepository;
        this.restClient = RestClient.builder().baseUrl(wikipediaBaseUrl).build();
    }

    @Transactional
    public TodaySpaceHistoryResponse getTodaySpaceHistory() {
        LocalDate today = LocalDate.now();
        Optional<TodaySpaceHistory> cached = todaySpaceHistoryRepository.findByEventDate(today);
        if (cached.isPresent()) {
            return toResponse(cached.get());
        }

        TodaySpaceHistory created = todaySpaceHistoryRepository.save(fetchFromWikipedia(today));
        return toResponse(created);
    }

    private TodaySpaceHistory fetchFromWikipedia(LocalDate today) {
        try {
            OnThisDayResponse response = restClient.get()
                    .uri("/feed/v1/wikipedia/en/onthisday/events/{month}/{day}",
                            today.getMonthValue(),
                            today.getDayOfMonth())
                    .retrieve()
                    .body(OnThisDayResponse.class);

            if (response == null || response.events() == null || response.events().isEmpty()) {
                return fallback(today);
            }

            Optional<EventItem> selected = response.events().stream()
                    .filter(event -> containsSpaceKeyword(event.text()))
                    .findFirst();

            if (selected.isEmpty()) {
                return fallback(today);
            }

            EventItem event = selected.get();
            String description = toJapaneseSummary(event);
            String title = "今日の宇宙史: " + event.year() + "年";
            return new TodaySpaceHistory(today, title, description, null, "Wikipedia On This Day");
        } catch (RestClientException exception) {
            return fallback(today);
        }
    }

    private boolean containsSpaceKeyword(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        String normalized = text.toLowerCase(Locale.ROOT);
        return SPACE_KEYWORDS.stream().anyMatch(normalized::contains);
    }

    private String toJapaneseSummary(EventItem event) {
        String text = event.text() == null ? "" : event.text();
        return event.year() + "年の今日、宇宙や空に関係する出来事が記録されています。"
                + "元データの概要: " + shorten(text, 180);
    }

    private TodaySpaceHistory fallback(LocalDate today) {
        return new TodaySpaceHistory(
                today,
                "今日の宇宙史",
                "今日に合う宇宙史の出来事は見つかりませんでした。夜空を見上げて、遠い星や月に思いを向けてみましょう。",
                null,
                "Starline"
        );
    }

    private TodaySpaceHistoryResponse toResponse(TodaySpaceHistory entity) {
        return new TodaySpaceHistoryResponse(
                entity.getEventDate(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getImageUrl(),
                entity.getSource()
        );
    }

    private String shorten(String text, int maxLength) {
        if (text == null) {
            return "";
        }
        if (text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 1) + "…";
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OnThisDayResponse(@JsonProperty("events") List<EventItem> events) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record EventItem(
            @JsonProperty("text") String text,
            @JsonProperty("year") Integer year
    ) {
    }
}
