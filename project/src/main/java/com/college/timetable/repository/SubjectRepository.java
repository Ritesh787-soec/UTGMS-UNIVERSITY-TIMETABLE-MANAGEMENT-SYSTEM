// src/main/java/com/college/timetable/repository/SubjectRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Long> {}