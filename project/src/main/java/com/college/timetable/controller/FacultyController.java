// src/main/java/com/college/timetable/controller/FacultyController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.FacultyRequest;
import com.college.timetable.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/faculties")
public class FacultyController {
    private final FacultyService facultyService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<?> getAll() {
        // Returns a wildcard collection response to safely map the service items
        return ResponseEntity.ok(facultyService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> create(@RequestBody FacultyRequest request) {
        return ResponseEntity.ok(facultyService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody FacultyRequest request) {
        return ResponseEntity.ok(facultyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        facultyService.delete(id);
    }

    @GetMapping("/{id}/workload")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<Object> getWorkload(@PathVariable Long id, @RequestParam String session) {
        // Cleanly bridges the workload response with the updated service layer
        return ResponseEntity.ok(facultyService.getWorkloadSummary(id, session));
    }
}