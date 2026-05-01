package com.starline.repository;

import com.starline.entity.SkyCheckRecord;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkyCheckRecordRepository extends JpaRepository<SkyCheckRecord, Long> {

    boolean existsByCheckedDate(LocalDate checkedDate);

    List<SkyCheckRecord> findAllByCheckedDateLessThanEqual(LocalDate checkedDate);
}
