package com.starline.controller;

import com.starline.dto.response.TodaySpaceHistoryResponse;
import com.starline.service.TodaySpaceHistoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/today-space-history")
public class TodaySpaceHistoryController {

    private final TodaySpaceHistoryService todaySpaceHistoryService;

    public TodaySpaceHistoryController(TodaySpaceHistoryService todaySpaceHistoryService) {
        this.todaySpaceHistoryService = todaySpaceHistoryService;
    }

    @GetMapping
    public TodaySpaceHistoryResponse getTodaySpaceHistory() {
        return todaySpaceHistoryService.getTodaySpaceHistory();
    }
}
