// src/main/java/com/college/timetable/repository/SemesterRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SemesterRepository extends JpaRepository<Semester, Long> {
    boolean existsByProgramId(Long programId);
}