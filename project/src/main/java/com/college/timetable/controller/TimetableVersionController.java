// src/main/java/com/college/timetable/controller/TimetableVersionController.java
package com.college.timetable.controller;

import com.college.timetable.model.TimetableEntry;
import com.college.timetable.model.TimetableVersion;
import com.college.timetable.repository.TimetableEntryRepository;
import com.college.timetable.repository.TimetableVersionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable/version")
public class TimetableVersionController {

    @Autowired
    private TimetableVersionRepository versionRepo;
    @Autowired
    private TimetableEntryRepository entryRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    // Mapping: POST /api/timetable/version
    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<TimetableVersion> saveVersion(@RequestParam Long sectionId) throws Exception {
        List<TimetableEntry> entries = entryRepo.findBySectionId(sectionId);
        TimetableVersion version = new TimetableVersion();
        version.setSectionId(sectionId);
        version.setSnapshotJson(mapper.writeValueAsString(entries));
        return ResponseEntity.ok(versionRepo.save(version));
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<List<TimetableVersion>> getHistory(@RequestParam Long sectionId) {
        return ResponseEntity.ok(versionRepo.findBySectionId(sectionId));
    }
}