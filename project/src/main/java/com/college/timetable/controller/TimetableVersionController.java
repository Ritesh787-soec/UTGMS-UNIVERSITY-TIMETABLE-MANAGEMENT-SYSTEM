// src/main/java/com/college/timetable/controller/TimetableVersionController.java
package com.college.timetable.controller;

import com.college.timetable.model.TimetableEntry;
import com.college.timetable.model.TimetableVersion;
import com.college.timetable.repository.TimetableEntryRepository;
import com.college.timetable.repository.TimetableVersionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable/version")
public class TimetableVersionController {

    @Autowired private TimetableVersionRepository versionRepo;
    @Autowired private TimetableEntryRepository entryRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public TimetableVersion saveVersion(@RequestParam Long sectionId) throws Exception {
        List<TimetableEntry> entries = entryRepo.findBySectionId(sectionId);
        TimetableVersion version = new TimetableVersion();
        version.setSectionId(sectionId);
        version.setSnapshotJson(mapper.writeValueAsString(entries));
        return versionRepo.save(version);
    }

    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public List<TimetableVersion> getHistory(@RequestParam Long sectionId) {
        return versionRepo.findBySectionId(sectionId);
    }
}