// src/main/java/com/college/timetable/repository/AllocationRepository.java

package com.college.timetable.repository;

import com.college.timetable.model.SubjectAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AllocationRepository extends JpaRepository<SubjectAllocation, Long> {

    List<SubjectAllocation> findBySectionId(Long sectionId);
    boolean existsBySectionId(Long sectionId);
    List<SubjectAllocation> findBySemesterIdAndSession(Long semesterId, String session);

    @Query("SELECT COALESCE(SUM(a.subject.theoryHrsPerWeek + a.subject.labHrsPerWeek), 0) " +
           "FROM SubjectAllocation a WHERE a.faculty.id = :facultyId AND a.session = :session")
    int sumHoursByFacultyIdAndSession(@Param("facultyId") Long facultyId, @Param("session") String session);
}
