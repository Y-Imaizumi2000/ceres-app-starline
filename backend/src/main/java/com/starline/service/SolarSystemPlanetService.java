package com.starline.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.starline.dto.response.SolarSystemPlanetResponse;
import com.starline.entity.SolarSystemPlanet;
import com.starline.repository.SolarSystemPlanetRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class SolarSystemPlanetService {

    private static final Map<String, String> JAPANESE_NAMES = Map.of(
            "Mercury", "水星",
            "Venus", "金星",
            "Earth", "地球",
            "Mars", "火星",
            "Jupiter", "木星",
            "Saturn", "土星",
            "Uranus", "天王星",
            "Neptune", "海王星"
    );

    private static final Map<String, Integer> DISPLAY_ORDER = Map.of(
            "Mercury", 1,
            "Venus", 2,
            "Earth", 3,
            "Mars", 4,
            "Jupiter", 5,
            "Saturn", 6,
            "Uranus", 7,
            "Neptune", 8
    );

    private final SolarSystemPlanetRepository solarSystemPlanetRepository;
    private final RestClient restClient;
    private final String apiKey;

    public SolarSystemPlanetService(
            SolarSystemPlanetRepository solarSystemPlanetRepository,
            @Value("${external.solar-system.base-url:https://api.le-systeme-solaire.net}") String baseUrl,
            @Value("${external.solar-system.api-key:}") String apiKey
    ) {
        this.solarSystemPlanetRepository = solarSystemPlanetRepository;
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.apiKey = apiKey;
    }

    @Transactional
    public synchronized List<SolarSystemPlanetResponse> getPlanets() {
        if (solarSystemPlanetRepository.count() == 0) {
            savePlanets(fetchPlanets());
        }
        return solarSystemPlanetRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    private List<SolarSystemPlanet> fetchPlanets() {
        if (apiKey == null || apiKey.isBlank()) {
            return fallbackPlanets();
        }

        try {
            SolarSystemBodiesResponse response = restClient.get()
                    .uri("/rest/bodies?filter[]=isPlanet,eq,true&data=id,englishName,moons,gravity,mass,meanRadius,avgTemp,sideralOrbit")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .retrieve()
                    .body(SolarSystemBodiesResponse.class);

            if (response == null || response.bodies() == null || response.bodies().isEmpty()) {
                return fallbackPlanets();
            }

            return response.bodies().stream()
                    .map(this::toPlanet)
                    .sorted(Comparator.comparingInt(SolarSystemPlanet::getDisplayOrder))
                    .toList();
        } catch (RestClientException exception) {
            return fallbackPlanets();
        }
    }

    private void savePlanets(List<SolarSystemPlanet> planets) {
        for (SolarSystemPlanet planet : planets) {
            solarSystemPlanetRepository.findByBodyId(planet.getBodyId())
                    .ifPresentOrElse(
                            existing -> existing.replaceContent(planet),
                            () -> solarSystemPlanetRepository.save(planet)
                    );
        }
    }

    private SolarSystemPlanet toPlanet(SolarSystemBody body) {
        String englishName = body.englishName();
        return new SolarSystemPlanet(
                body.id(),
                JAPANESE_NAMES.getOrDefault(englishName, englishName),
                englishName,
                DISPLAY_ORDER.getOrDefault(englishName, 99),
                body.moons() == null ? 0 : body.moons().size(),
                valueOrZero(body.gravity()),
                body.mass() == null ? 0 : valueOrZero(body.mass().massValue()),
                body.mass() == null || body.mass().massExponent() == null ? 0 : body.mass().massExponent(),
                valueOrZero(body.meanRadius()),
                body.avgTemp() == null ? 0 : body.avgTemp(),
                valueOrZero(body.sideralOrbit()),
                "Solar System OpenData"
        );
    }

    private List<SolarSystemPlanet> fallbackPlanets() {
        return List.of(
                new SolarSystemPlanet("mercure", "水星", "Mercury", 1, 0, 3.7, 3.3011, 23, 2439.4, 440, 87.97, "Starline built-in"),
                new SolarSystemPlanet("venus", "金星", "Venus", 2, 0, 8.87, 4.8675, 24, 6051.8, 737, 224.7, "Starline built-in"),
                new SolarSystemPlanet("terre", "地球", "Earth", 3, 1, 9.8, 5.97237, 24, 6371.0, 288, 365.26, "Starline built-in"),
                new SolarSystemPlanet("mars", "火星", "Mars", 4, 2, 3.71, 6.4171, 23, 3389.5, 210, 686.98, "Starline built-in"),
                new SolarSystemPlanet("jupiter", "木星", "Jupiter", 5, 95, 24.79, 1.8982, 27, 69911.0, 165, 4332.59, "Starline built-in"),
                new SolarSystemPlanet("saturne", "土星", "Saturn", 6, 146, 10.44, 5.6834, 26, 58232.0, 134, 10759.22, "Starline built-in"),
                new SolarSystemPlanet("uranus", "天王星", "Uranus", 7, 28, 8.87, 8.6810, 25, 25362.0, 76, 30685.4, "Starline built-in"),
                new SolarSystemPlanet("neptune", "海王星", "Neptune", 8, 16, 11.15, 1.02413, 26, 24622.0, 72, 60189.0, "Starline built-in")
        );
    }

    private SolarSystemPlanetResponse toResponse(SolarSystemPlanet entity) {
        return new SolarSystemPlanetResponse(
                entity.getBodyId(),
                entity.getName(),
                entity.getEnglishName(),
                entity.getMoonCount(),
                entity.getGravity(),
                entity.getMassValue(),
                entity.getMassExponent(),
                entity.getMeanRadius(),
                entity.getAverageTemperature(),
                entity.getOrbitalPeriod(),
                entity.getSource()
        );
    }

    private double valueOrZero(Double value) {
        return value == null ? 0 : value;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SolarSystemBodiesResponse(@JsonProperty("bodies") List<SolarSystemBody> bodies) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SolarSystemBody(
            @JsonProperty("id") String id,
            @JsonProperty("englishName") String englishName,
            @JsonProperty("moons") List<Object> moons,
            @JsonProperty("gravity") Double gravity,
            @JsonProperty("mass") SolarSystemMass mass,
            @JsonProperty("meanRadius") Double meanRadius,
            @JsonProperty("avgTemp") Integer avgTemp,
            @JsonProperty("sideralOrbit") Double sideralOrbit
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SolarSystemMass(
            @JsonProperty("massValue") Double massValue,
            @JsonProperty("massExponent") Integer massExponent
    ) {
    }
}
