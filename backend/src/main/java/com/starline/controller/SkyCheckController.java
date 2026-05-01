package com.starline.controller;

import com.starline.dto.response.SkyCheckStatusResponse;
import com.starline.service.SkyCheckService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sky-check")
public class SkyCheckController {

    private final SkyCheckService skyCheckService;

    public SkyCheckController(SkyCheckService skyCheckService) {
        this.skyCheckService = skyCheckService;
    }

    @GetMapping("/today")
    public SkyCheckStatusResponse getTodayStatus() {
        return skyCheckService.getStatus();
    }

    @PostMapping("/today")
    public SkyCheckStatusResponse checkToday() {
        return skyCheckService.checkToday();
    }
}
