package com.starline.repository;

import com.starline.entity.TodaySpaceImage;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodaySpaceImageRepository extends JpaRepository<TodaySpaceImage, Long> {

    Optional<TodaySpaceImage> findByImageDate(LocalDate imageDate);
}
