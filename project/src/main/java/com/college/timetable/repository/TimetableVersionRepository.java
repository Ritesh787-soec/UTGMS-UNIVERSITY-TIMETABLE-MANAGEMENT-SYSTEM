// src/main/java/com/college/timetable/repository/TimetableVersionRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.TimetableVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableVersionRepository extends JpaRepository<TimetableVersion, Long> {
    int countBySectionIdAndSession(Long semesterId, String session);

    List<TimetableVersion> findBySectionIdAndSession(Long semesterId, String session);

    List<com.college.timetable.model.TimetableVersion> findBySectionId(Long sectionId);
}