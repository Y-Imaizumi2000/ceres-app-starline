package com.starline.controller;

import com.starline.dto.response.TonightSkyResponse;
import com.starline.service.TonightSkyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tonight-sky")
public class TonightSkyController {

    private final TonightSkyService tonightSkyService;

    public TonightSkyController(TonightSkyService tonightSkyService) {
        this.tonightSkyService = tonightSkyService;
    }

    @GetMapping
    public TonightSkyResponse getTonightSky(
            @RequestParam(value = "location", defaultValue = "東京都") String location
    ) {
        return tonightSkyService.getTonightSky(location);
    }
}