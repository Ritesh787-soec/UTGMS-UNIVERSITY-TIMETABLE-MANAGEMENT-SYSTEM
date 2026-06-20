// src/main/java/com/college/timetable/controller/AllocationController.java
package com.college.timetable.controller;

import com.college.timetable.dto.AllocationRequest;
import com.college.timetable.model.SubjectAllocation;
import com.college.timetable.service.AllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/allocations")
public class AllocationController {
    private final AllocationService allocationService;

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public SubjectAllocation create(@RequestBody AllocationRequest request) {
        return allocationService.createAllocation(request);
    }

    @GetMapping("/section/{sectionId}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public List<SubjectAllocation> getBySection(@PathVariable Long sectionId) {
        return allocationService.getAllocationsBySection(sectionId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public void delete(@PathVariable Long id) { allocationService.deleteAllocation(id); }
}