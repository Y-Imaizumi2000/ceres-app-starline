package com.starline.controller;

import com.starline.dto.response.TodaySpaceImageResponse;
import com.starline.service.TodaySpaceImageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/today-space-image")
public class TodaySpaceImageController {

    private final TodaySpaceImageService todaySpaceImageService;

    public TodaySpaceImageController(TodaySpaceImageService todaySpaceImageService) {
        this.todaySpaceImageService = todaySpaceImageService;
    }

    @GetMapping
    public TodaySpaceImageResponse getTodaySpaceImage() {
        return todaySpaceImageService.getTodaySpaceImage();
    }
}
