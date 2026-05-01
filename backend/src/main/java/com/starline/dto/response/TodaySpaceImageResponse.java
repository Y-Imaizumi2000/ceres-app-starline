package com.starline.dto.response;

import java.time.LocalDate;

public record TodaySpaceImageResponse(
        LocalDate date,
        String title,
        String description,
        String imageUrl,
        String mediaType,
        String source
) {
}
