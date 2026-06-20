// src/main/java/com/college/timetable/repository/SectionRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectionRepository extends JpaRepository<Section, Long> {
    boolean existsBySemesterId(Long semesterId);
}