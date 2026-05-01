package com.starline.repository;

import com.starline.entity.SolarSystemPlanet;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolarSystemPlanetRepository extends JpaRepository<SolarSystemPlanet, Long> {

    List<SolarSystemPlanet> findAllByOrderByDisplayOrderAsc();

    Optional<SolarSystemPlanet> findByBodyId(String bodyId);
}
