package com.starline.dto.response;

import java.time.LocalDate;

public record SkyCheckStatusResponse(
        boolean checkedToday,
        int streakDays,
        LocalDate lastCheckedDate
) {
}
