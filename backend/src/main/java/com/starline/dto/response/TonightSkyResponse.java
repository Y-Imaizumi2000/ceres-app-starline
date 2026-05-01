package com.starline.dto.response;

import java.util.List;

public record TonightSkyResponse(
        String location,
        String visibility,
        String moonInfo,
        List<String> highlights,
        String advice,
        String source
) {
}
