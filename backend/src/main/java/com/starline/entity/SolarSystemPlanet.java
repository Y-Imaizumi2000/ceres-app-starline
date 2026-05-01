package com.starline.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "solar_system_planets")
public class SolarSystemPlanet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "body_id", nullable = false, unique = true, length = 80)
    private String bodyId;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(name = "english_name", nullable = false, length = 80)
    private String englishName;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "moon_count", nullable = false)
    private int moonCount;

    @Column(nullable = false)
    private double gravity;

    @Column(name = "mass_value", nullable = false)
    private double massValue;

    @Column(name = "mass_exponent", nullable = false)
    private int massExponent;

    @Column(name = "mean_radius", nullable = false)
    private double meanRadius;

    @Column(name = "average_temperature", nullable = false)
    private int averageTemperature;

    @Column(name = "orbital_period", nullable = false)
    private double orbitalPeriod;

    @Column(nullable = false, length = 200)
    private String source;

    protected SolarSystemPlanet() {
    }

    public SolarSystemPlanet(
            String bodyId,
            String name,
            String englishName,
            int displayOrder,
            int moonCount,
            double gravity,
            double massValue,
            int massExponent,
            double meanRadius,
            int averageTemperature,
            double orbitalPeriod,
            String source
    ) {
        this.bodyId = bodyId;
        this.name = name;
        this.englishName = englishName;
        this.displayOrder = displayOrder;
        this.moonCount = moonCount;
        this.gravity = gravity;
        this.massValue = massValue;
        this.massExponent = massExponent;
        this.meanRadius = meanRadius;
        this.averageTemperature = averageTemperature;
        this.orbitalPeriod = orbitalPeriod;
        this.source = source;
    }

    public String getBodyId() {
        return bodyId;
    }

    public String getName() {
        return name;
    }

    public String getEnglishName() {
        return englishName;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public int getMoonCount() {
        return moonCount;
    }

    public double getGravity() {
        return gravity;
    }

    public double getMassValue() {
        return massValue;
    }

    public int getMassExponent() {
        return massExponent;
    }

    public double getMeanRadius() {
        return meanRadius;
    }

    public int getAverageTemperature() {
        return averageTemperature;
    }

    public double getOrbitalPeriod() {
        return orbitalPeriod;
    }

    public String getSource() {
        return source;
    }

    public void replaceContent(SolarSystemPlanet planet) {
        this.name = planet.name;
        this.englishName = planet.englishName;
        this.displayOrder = planet.displayOrder;
        this.moonCount = planet.moonCount;
        this.gravity = planet.gravity;
        this.massValue = planet.massValue;
        this.massExponent = planet.massExponent;
        this.meanRadius = planet.meanRadius;
        this.averageTemperature = planet.averageTemperature;
        this.orbitalPeriod = planet.orbitalPeriod;
        this.source = planet.source;
    }
}
