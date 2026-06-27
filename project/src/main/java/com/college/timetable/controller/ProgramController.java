// src/main/java/com/college/timetable/controller/ProgramController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.ProgramRequest;
import com.college.timetable.model.Program;
import com.college.timetable.service.ProgramService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/programs")
public class ProgramController {
    private final ProgramService programService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public List<Program> getAll() { return programService.getAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public Program getById(@PathVariable Long id) { return programService.getById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Program create(@RequestBody ProgramRequest request) { return programService.create(request); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Program update(@PathVariable Long id, @RequestBody ProgramRequest request) {
        return programService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { programService.delete(id); }

    public ProgramController(ProgramService programService) {
        this.programService = programService;
    }
}