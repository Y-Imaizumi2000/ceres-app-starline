package com.starline.repository;

import com.starline.entity.TodaySpaceHistory;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodaySpaceHistoryRepository extends JpaRepository<TodaySpaceHistory, Long> {

    Optional<TodaySpaceHistory> findByEventDate(LocalDate eventDate);
}
