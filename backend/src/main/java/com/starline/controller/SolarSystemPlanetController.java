package com.starline.controller;

import com.starline.dto.response.SolarSystemPlanetResponse;
import com.starline.service.SolarSystemPlanetService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/solar-system/planets")
public class SolarSystemPlanetController {

    private final SolarSystemPlanetService solarSystemPlanetService;

    public SolarSystemPlanetController(SolarSystemPlanetService solarSystemPlanetService) {
        this.solarSystemPlanetService = solarSystemPlanetService;
    }

    @GetMapping
    public List<SolarSystemPlanetResponse> getPlanets() {
        return solarSystemPlanetService.getPlanets();
    }
}
