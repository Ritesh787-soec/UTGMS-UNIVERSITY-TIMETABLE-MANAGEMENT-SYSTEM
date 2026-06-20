// src/main/java/com/college/timetable/repository/ProgramRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository extends JpaRepository<Program, Long> {
    boolean existsByDepartmentId(Long departmentId);
}