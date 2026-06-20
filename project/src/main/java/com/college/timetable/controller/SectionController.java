// src/main/java/com/college/timetable/controller/SectionController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.SectionRequest;
import com.college.timetable.model.Section;
import com.college.timetable.service.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sections")
public class SectionController {
    private final SectionService sectionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public List<Section> getAll() { return sectionService.getAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public Section getById(@PathVariable Long id) { return sectionService.getById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Section create(@RequestBody SectionRequest request) { return sectionService.create(request); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Section update(@PathVariable Long id, @RequestBody SectionRequest request) {
        return sectionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { sectionService.delete(id); }
}