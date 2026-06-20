// src/main/java/com/college/timetable/controller/SemesterController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.SemesterRequest;
import com.college.timetable.model.Semester;
import com.college.timetable.service.SemesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/semesters")
public class SemesterController {
    private final SemesterService semesterService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public List<Semester> getAll() { return semesterService.getAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public Semester getById(@PathVariable Long id) { return semesterService.getById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Semester create(@RequestBody SemesterRequest request) { return semesterService.create(request); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Semester update(@PathVariable Long id, @RequestBody SemesterRequest request) {
        return semesterService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { semesterService.delete(id); }
}