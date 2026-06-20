// src/main/java/com/college/timetable/controller/SubjectController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.SubjectRequest;
import com.college.timetable.model.Subject;
import com.college.timetable.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subjects")
public class SubjectController {
    private final SubjectService subjectService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public List<Subject> getAll() { return subjectService.getAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public Subject getById(@PathVariable Long id) { return subjectService.getById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Subject create(@RequestBody SubjectRequest request) { return subjectService.create(request); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Subject update(@PathVariable Long id, @RequestBody SubjectRequest request) {
        return subjectService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { subjectService.delete(id); }
}