package com.starline.service;

import com.starline.dto.response.SkyCheckStatusResponse;
import com.starline.entity.SkyCheckRecord;
import com.starline.repository.SkyCheckRecordRepository;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SkyCheckService {

    private final SkyCheckRecordRepository skyCheckRecordRepository;

    public SkyCheckService(SkyCheckRecordRepository skyCheckRecordRepository) {
        this.skyCheckRecordRepository = skyCheckRecordRepository;
    }

    @Transactional
    public SkyCheckStatusResponse checkToday() {
        LocalDate today = LocalDate.now();
        if (!skyCheckRecordRepository.existsByCheckedDate(today)) {
            skyCheckRecordRepository.save(new SkyCheckRecord(today));
        }
        return getStatus();
    }

    @Transactional(readOnly = true)
    public SkyCheckStatusResponse getStatus() {
        LocalDate today = LocalDate.now();
        Set<LocalDate> checkedDates = skyCheckRecordRepository.findAllByCheckedDateLessThanEqual(today).stream()
                .map(SkyCheckRecord::getCheckedDate)
                .collect(Collectors.toSet());

        boolean checkedToday = checkedDates.contains(today);
        int streakDays = calculateStreakDays(today, checkedDates);
        LocalDate lastCheckedDate = checkedDates.stream().max(Comparator.naturalOrder()).orElse(null);
        return new SkyCheckStatusResponse(checkedToday, streakDays, lastCheckedDate);
    }

    private int calculateStreakDays(LocalDate fromDate, Set<LocalDate> checkedDates) {
        int streak = 0;
        LocalDate cursor = fromDate;
        while (checkedDates.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }
        return streak;
    }
}
