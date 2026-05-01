package com.starline.dto.response;

import java.time.LocalDate;

public record TodaySpaceHistoryResponse(
        LocalDate date,
        String title,
        String description,
        String imageUrl,
        String source
) {
}
