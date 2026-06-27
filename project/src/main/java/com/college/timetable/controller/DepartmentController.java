// src/main/java/com/college/timetable/controller/DepartmentController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.DepartmentRequest;
import com.college.timetable.model.Department;
import com.college.timetable.service.DepartmentService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/departments")
public class DepartmentController {
    private final DepartmentService departmentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public List<Department> getAll() { return departmentService.getAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public Department getById(@PathVariable Long id) { return departmentService.getById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Department create(@RequestBody DepartmentRequest request) { return departmentService.create(request); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Department update(@PathVariable Long id, @RequestBody DepartmentRequest request) {
        return departmentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { departmentService.delete(id); }

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }
}