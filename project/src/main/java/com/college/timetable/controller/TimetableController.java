// src/main/java/com/college/timetable/controller/TimetableController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.MoveEntryRequest;
import com.college.timetable.dto.response.ClashCheckDTO;
import com.college.timetable.dto.response.GenerationResultDto;
import com.college.timetable.exception.ConflictException;
import com.college.timetable.exception.ResourceNotFoundException;
import com.college.timetable.model.TimetableEntry;
import com.college.timetable.model.TimetableVersion;
import com.college.timetable.repository.FacultyRepository;
import com.college.timetable.service.TimetableGenerationService;
import com.college.timetable.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/timetable")
public class TimetableController {

    private final TimetableGenerationService generationService;
    private final TimetableService timetableService;
    private final FacultyRepository facultyRepository;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('COORDINATOR')")
    public GenerationResultDto generate(@RequestParam Long semesterId, @RequestParam String session) {
        return generationService.generate(semesterId, session);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<TimetableEntry> getEntries(
            @RequestParam(required = false) Long sectionId,
            @RequestParam(required = false) Long facultyId,
            Authentication authentication) {

        if (sectionId != null) return timetableService.getTimetableBySection(sectionId);

        if (facultyId != null) {
            boolean isAdminOrCoord = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_COORDINATOR"));

            if (!isAdminOrCoord) {
                String email = authentication.getName();
                var faculty = facultyRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("No faculty profile linked to this account"));
                if (!faculty.getId().equals(facultyId)) {
                    throw new ConflictException("You can only view your own timetable");
                }
            }
            return timetableService.getTimetableByFaculty(facultyId);
        }

        throw new IllegalArgumentException("Provide sectionId or facultyId as a query parameter");
    }

    @GetMapping("/check")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ClashCheckDTO checkSlot(@RequestParam Long facultyId, @RequestParam Long roomId,
                                    @RequestParam String day, @RequestParam int slot) {
        return timetableService.checkSlot(facultyId, roomId, day, slot);
    }

    @PutMapping("/entry/{id}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public TimetableEntry moveEntry(@PathVariable Long id, @RequestBody MoveEntryRequest request) {
        return timetableService.moveEntry(id, request);
    }

    @PutMapping("/entry/{id}/lock")
    @PreAuthorize("hasRole('COORDINATOR')")
    public TimetableEntry toggleLock(@PathVariable Long id) {
        return timetableService.toggleLock(id);
    }

    @PostMapping("/version")
    @PreAuthorize("hasRole('COORDINATOR')")
    public TimetableVersion saveVersion(@RequestParam Long semesterId, @RequestParam String session) {
        return timetableService.saveVersion(semesterId, session);
    }

    @GetMapping("/version")
    @PreAuthorize("hasRole('COORDINATOR')")
    public List<TimetableVersion> getVersionHistory(@RequestParam Long semesterId, @RequestParam String session) {
        return timetableService.getVersionHistory(semesterId, session);
    }
}