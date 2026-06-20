// src/main/java/com/college/timetable/controller/FacultyController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.FacultyRequest;
import com.college.timetable.dto.response.WorkloadSummaryDTO;
import com.college.timetable.model.Faculty;
import com.college.timetable.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/faculties")
public class FacultyController {
    private final FacultyService facultyService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public List<Faculty> getAll() { return facultyService.getAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public Faculty getById(@PathVariable Long id) { return facultyService.getById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Faculty create(@RequestBody FacultyRequest request) { return facultyService.create(request); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Faculty update(@PathVariable Long id, @RequestBody FacultyRequest request) {
        return facultyService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { facultyService.delete(id); }

    @GetMapping("/{id}/workload")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public WorkloadSummaryDTO getWorkload(@PathVariable Long id, @RequestParam String session) {
        return facultyService.getWorkloadSummary(id, session);
    }
}