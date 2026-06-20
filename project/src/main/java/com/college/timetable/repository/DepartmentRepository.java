// src/main/java/com/college/timetable/repository/DepartmentRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {}