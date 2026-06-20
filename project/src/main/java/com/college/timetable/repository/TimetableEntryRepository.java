// src/main/java/com/college/timetable/repository/TimetableEntryRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, Long> {

    List<TimetableEntry> findBySectionId(Long sectionId);
    List<TimetableEntry> findByFacultyId(Long facultyId);

    boolean existsByFacultyIdAndDayOfWeekAndSlotNumber(Long facultyId, String dayOfWeek, Integer slotNumber);
    boolean existsByRoomIdAndDayOfWeekAndSlotNumber(Long roomId, String dayOfWeek, Integer slotNumber);
    boolean existsBySectionIdAndDayOfWeekAndSlotNumber(Long sectionId, String dayOfWeek, Integer slotNumber);

    boolean existsByFacultyIdAndDayOfWeekAndSlotNumberAndIdNot(Long facultyId, String dayOfWeek, Integer slotNumber, Long id);
    boolean existsByRoomIdAndDayOfWeekAndSlotNumberAndIdNot(Long roomId, String dayOfWeek, Integer slotNumber, Long id);
    boolean existsBySectionIdAndDayOfWeekAndSlotNumberAndIdNot(Long sectionId, String dayOfWeek, Integer slotNumber, Long id);

    @Query("SELECT COUNT(e) FROM TimetableEntry e WHERE e.faculty.id = :facultyId AND e.session = :session")
    int countByFacultyIdAndSession(@Param("facultyId") Long facultyId, @Param("session") String session);

    @Query("SELECT COUNT(e) FROM TimetableEntry e WHERE e.faculty.id = :facultyId AND e.semester.id = :semesterId AND e.session = :session")
    int countByFacultyIdAndSemesterIdAndSession(@Param("facultyId") Long facultyId, @Param("semesterId") Long semesterId, @Param("session") String session);

    @Query("SELECT COUNT(e) FROM TimetableEntry e WHERE e.room.id = :roomId AND e.semester.id = :semesterId AND e.session = :session")
    int countByRoomIdAndSemesterIdAndSession(@Param("roomId") Long roomId, @Param("semesterId") Long semesterId, @Param("session") String session);

    @Query("SELECT e FROM TimetableEntry e WHERE e.semester.id = :semesterId AND e.session = :session")
    List<TimetableEntry> findBySemesterIdAndSession(@Param("semesterId") Long semesterId, @Param("session") String session);
}