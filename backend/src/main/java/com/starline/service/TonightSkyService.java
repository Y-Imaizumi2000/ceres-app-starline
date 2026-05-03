package com.starline.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.starline.dto.response.TonightSkyResponse;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class TonightSkyService {

    private final RestClient nominatimClient;
    private final RestClient astronomyClient;
    private final String apiKey;

    public TonightSkyService(
            @Value("${external.ipgeolocation.api-key}") String apiKey
    ) {
        this.nominatimClient = RestClient.builder()
                .baseUrl("https://nominatim.openstreetmap.org")
                .defaultHeader("User-Agent", "Starline/1.0")
                .build();
        this.astronomyClient = RestClient.builder()
                .baseUrl("https://api.ipgeolocation.io")
                .build();
        this.apiKey = apiKey;
    }

    public TonightSkyResponse getTonightSky(String location) {
        try {
            // ① Nominatim で緯度経度に変換
            NominatimResponse[] results = nominatimClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("q", location)
                            .queryParam("format", "json")
                            .queryParam("limit", 1)
                            .build())
                    .retrieve()
                    .body(NominatimResponse[].class);

            if (results == null || results.length == 0) {
                return fallback(location);
            }

            double lat = Double.parseDouble(results[0].lat());
            double lon = Double.parseDouble(results[0].lon());

            // ② ipgeolocation.io で天文データ取得
            AstronomyResponse astronomy = astronomyClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/astronomy")
                            .queryParam("apiKey", apiKey)
                            .queryParam("lat", lat)
                            .queryParam("long", lon)
                            .build())
                    .retrieve()
                    .body(AstronomyResponse.class);

            if (astronomy == null) {
                return fallback(location);
            }

            // ③ レスポンス組み立て
            String moonInfo = buildMoonInfo(astronomy);
            String visibility = buildVisibility(astronomy);
            List<String> highlights = buildHighlights();
            String advice = buildAdvice(astronomy);

            return new TonightSkyResponse(
                    location,
                    visibility,
                    moonInfo,
                    highlights,
                    advice,
                    "ipgeolocation.io / OpenStreetMap"
            );

        } catch (RestClientException e) {
            return fallback(location);
        }
    }

    private String buildMoonInfo(AstronomyResponse astronomy) {
        String phase = translateMoonPhase(astronomy.moonPhase());
        return phase + "（月の出: " + astronomy.moonrise() + "、月の入り: " + astronomy.moonset() + "）";
    }

    private String buildVisibility(AstronomyResponse astronomy) {
        if (astronomy.moonPhase() == null) return "中";
        return switch (astronomy.moonPhase()) {
            case "NEW_MOON" -> "高";
            case "WAXING_CRESCENT", "WANING_CRESCENT" -> "高";
            case "FIRST_QUARTER", "LAST_QUARTER" -> "中";
            case "WAXING_GIBBOUS", "WANING_GIBBOUS" -> "低";
            case "FULL_MOON" -> "低";
            default -> "中";
        };
    }

    private String translateMoonPhase(String phase) {
        if (phase == null) return "不明";
        return switch (phase) {
            case "NEW_MOON" -> "新月";
            case "WAXING_CRESCENT" -> "三日月";
            case "FIRST_QUARTER" -> "上弦の月";
            case "WAXING_GIBBOUS" -> "十三夜月";
            case "FULL_MOON" -> "満月";
            case "WANING_GIBBOUS" -> "十六夜月";
            case "LAST_QUARTER" -> "下弦の月";
            case "WANING_CRESCENT" -> "有明月";
            default -> phase;
        };
    }

    private List<String> buildHighlights() {
        int month = LocalDate.now().getMonthValue();
        if (month >= 3 && month <= 5) return List.of("春の大三角", "しし座", "北斗七星");
        if (month >= 6 && month <= 8) return List.of("夏の大三角", "こと座のベガ", "さそり座のアンタレス");
        if (month >= 9 && month <= 11) return List.of("秋の四辺形", "ペガスス座", "アンドロメダ座");
        return List.of("オリオン座", "シリウス", "冬の大三角");
    }

    private String buildAdvice(AstronomyResponse astronomy) {
        String sunset = astronomy.sunset() != null ? astronomy.sunset() : "日没後";
        int month = LocalDate.now().getMonthValue();
        String seasonal = switch (month / 3) {
            case 1 -> "東から南の空を中心に探してみましょう。";
            case 2 -> "南から東の空を中心に、明るい星を目印に探してみましょう。";
            case 3 -> "東の空から天頂にかけて広く見渡してみましょう。";
            default -> "南の空のオリオン座を見つけると、冬の星をたどりやすくなります。";
        };
        return "日没（" + sunset + "）以降の観察がおすすめです。" + seasonal;
    }

    private TonightSkyResponse fallback(String location) {
        return new TonightSkyResponse(
                location,
                "中",
                "月情報を取得できませんでした",
                buildHighlights(),
                "夜空を見上げて、明るい星を探してみましょう。",
                "Starline 星座データ"
        );
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record NominatimResponse(
            @JsonProperty("lat") String lat,
            @JsonProperty("lon") String lon,
            @JsonProperty("display_name") String displayName
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record AstronomyResponse(
            @JsonProperty("moonrise") String moonrise,
            @JsonProperty("moonset") String moonset,
            @JsonProperty("moon_phase") String moonPhase,
            @JsonProperty("sunset") String sunset,
            @JsonProperty("sunrise") String sunrise
    ) {}
}