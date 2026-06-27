// src/main/java/com/college/timetable/controller/AllocationController.java
package com.college.timetable.controller;

import com.college.timetable.dto.AllocationRequest;
import com.college.timetable.service.AllocationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/allocations")
public class AllocationController {
    private final AllocationService allocationService;

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<Object> create(@RequestBody AllocationRequest request) {
        // Wrapped with ResponseEntity<Object> to handle the generic service return type
        // seamlessly
        return ResponseEntity.ok(allocationService.createAllocation(request));
    }

    @GetMapping("/section/{sectionId}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<?> getBySection(@PathVariable Long sectionId) {
        // Uses a wildcard response entity to perfectly align with the service's
        // returned collection structure
        return ResponseEntity.ok(allocationService.getAllocationsBySection(sectionId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public void delete(@PathVariable Long id) {
        allocationService.deleteAllocation(id);
    }

    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }
}