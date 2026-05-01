package com.starline.dto.response;

public record SolarSystemPlanetResponse(
        String id,
        String name,
        String englishName,
        int moonCount,
        double gravity,
        double massValue,
        int massExponent,
        double meanRadius,
        int averageTemperature,
        double orbitalPeriod,
        String source
) {
}
