package com.college.timetable.repository;

import com.college.timetable.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    // Spring automatically generates basic database queries!
    // Adding this allows you to find a teacher by code instantly later during
    // conflict loops
    Optional<Faculty> findByEmployeeCode(String employeeCode);

    Optional<Faculty> findByEmail(String email);
}