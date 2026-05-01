package com.starline.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "sky_check_records")
public class SkyCheckRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "checked_date", nullable = false, unique = true)
    private LocalDate checkedDate;

    protected SkyCheckRecord() {
    }

    public SkyCheckRecord(LocalDate checkedDate) {
        this.checkedDate = checkedDate;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getCheckedDate() {
        return checkedDate;
    }
}
