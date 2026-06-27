// src/main/java/com/college/timetable/controller/ResourceController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.ResourceRequest;
import com.college.timetable.model.Resource;
import com.college.timetable.service.ResourceService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/resources")
public class ResourceController {
    private final ResourceService resourceService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public List<Resource> getAll() { return resourceService.getAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public Resource getById(@PathVariable Long id) { return resourceService.getById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Resource create(@RequestBody ResourceRequest request) { return resourceService.create(request); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Resource update(@PathVariable Long id, @RequestBody ResourceRequest request) {
        return resourceService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { resourceService.delete(id); }

    @PutMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('ADMIN')")
    public Resource toggleActive(@PathVariable Long id) { return resourceService.toggleActive(id); }

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }
}