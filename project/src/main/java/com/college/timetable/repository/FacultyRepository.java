// src/main/java/com/college/timetable/repository/FacultyRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByEmail(String email);
}