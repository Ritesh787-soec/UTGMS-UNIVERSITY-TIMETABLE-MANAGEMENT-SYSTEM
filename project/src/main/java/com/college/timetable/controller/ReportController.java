// src/main/java/com/college/timetable/controller/ReportController.java
package com.college.timetable.controller;

import com.college.timetable.dto.WorkloadDto;
import com.college.timetable.model.Faculty;
import com.college.timetable.model.Resource;
import com.college.timetable.repository.FacultyRepository;
import com.college.timetable.repository.ResourceRepository;
import com.college.timetable.repository.TimetableEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private FacultyRepository facultyRepo;
    @Autowired
    private ResourceRepository resourceRepo;
    @Autowired
    private TimetableEntryRepository entryRepo;

    private static final int WORKING_DAYS = 6;
    private static final int SLOTS_PER_DAY = 8;

    @GetMapping("/workload")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<List<WorkloadDto>> workloadReport() {
        List<Faculty> facultyList = facultyRepo.findAll();
        List<WorkloadDto> report = new ArrayList<>();

        for (Faculty faculty : facultyList) {
            long assignedHours = entryRepo.countByFacultyId(faculty.getId());
            int maxHours = faculty.getMaxHoursPerWeek() != null ? faculty.getMaxHoursPerWeek() : 0;
            double utilization = maxHours == 0 ? 0 : (assignedHours * 100.0 / maxHours);

            report.add(new WorkloadDto(faculty.getName(), faculty.getDesignation(),
                    assignedHours, maxHours, Math.round(utilization * 100.0) / 100.0));
        }
        return ResponseEntity.ok(report);
    }

    @GetMapping("/rooms")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<List<Map<String, Object>>> roomUtilisationReport() {
        List<Resource> rooms = resourceRepo.findAll();
        List<Map<String, Object>> report = new ArrayList<>();
        int totalSlots = WORKING_DAYS * SLOTS_PER_DAY;

        for (Resource room : rooms) {
            long occupied = entryRepo.countByRoomId(room.getId());
            double utilization = (occupied * 100.0) / totalSlots;

            report.add(Map.of(
                    "roomNumber", room.getRoomNumber(),
                    "type", room.getType(),
                    "capacity", room.getCapacity(),
                    "occupiedSlots", occupied,
                    "totalSlots", totalSlots,
                    "utilization", Math.round(utilization * 100.0) / 100.0));
        }
        return ResponseEntity.ok(report);
    }
}