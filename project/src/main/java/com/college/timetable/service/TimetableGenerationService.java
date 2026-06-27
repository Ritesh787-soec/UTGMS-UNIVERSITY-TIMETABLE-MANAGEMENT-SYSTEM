// src/main/java/com/college/timetable/service/TimetableGenerationService.java
package com.college.timetable.service;

import com.college.timetable.dto.response.ConflictDto;
import com.college.timetable.dto.response.GenerationResultDto;
import com.college.timetable.model.*;
import com.college.timetable.repository.AllocationRepository;
import com.college.timetable.repository.ResourceRepository;
import com.college.timetable.repository.TimetableEntryRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service

public class TimetableGenerationService {

    private static final String[] DAYS = { "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY" };
    private static final int TOTAL_SLOTS = 8;

    private final AllocationRepository allocationRepository;
    private final TimetableEntryRepository entryRepo;
    private final ResourceRepository resourceRepo;

    public GenerationResultDto generate(Long semesterId, String session) {
        // Using your repository method directly since it exists!
        List<SubjectAllocation> allocations = allocationRepository.findBySemesterIdAndSession(semesterId, session);
        List<ConflictDto> conflicts = new ArrayList<>();
        int totalPlaced = 0;

        for (SubjectAllocation allocation : allocations) {
            Subject subject = allocation.getSubject();
            Faculty faculty = allocation.getFaculty();
            Section section = allocation.getSection();
            Semester semester = allocation.getSemester();

            Resource room = pickRoom(subject, section);
            if (room == null) {
                conflicts.add(new ConflictDto(subject.getSubjectName(), section.getName(),
                        "No suitable room found (check room type/capacity/active status)"));
                continue;
            }

            if (subject.getLabHrsPerWeek() != null && subject.getLabHrsPerWeek() > 0) {
                int labSessions = Math.max(1, subject.getLabHrsPerWeek() / 2);
                for (int i = 0; i < labSessions; i++) {
                    boolean placed = placeLabSession(subject, faculty, section, room, semester, session);
                    if (placed)
                        totalPlaced += 2;
                    else
                        conflicts.add(new ConflictDto(subject.getSubjectName(), section.getName(),
                                "No 2 consecutive free slots found for lab"));
                }
            }

            if (subject.getTheoryHrsPerWeek() != null && subject.getTheoryHrsPerWeek() > 0) {
                for (int i = 0; i < subject.getTheoryHrsPerWeek(); i++) {
                    boolean placed = placeTheorySlot(subject, faculty, section, room, semester, session);
                    if (placed)
                        totalPlaced++;
                    else {
                        conflicts.add(new ConflictDto(subject.getSubjectName(), section.getName(),
                                faculty.getName() + " fully booked or no free slot available"));
                        break;
                    }
                }
            }
        }

        return new GenerationResultDto("COMPLETED", totalPlaced, conflicts.size(), conflicts);
    }

    private Resource pickRoom(Subject subject, Section section) {
        String roomType = (subject.getType() != null && subject.getType().equalsIgnoreCase("LAB")) ? "LAB"
                : "CLASSROOM";
        if (section.getStudentStrength() == null)
            return null;

        List<Resource> candidates = resourceRepo.findByTypeAndIsActiveTrue(roomType);
        return candidates.stream()
                .filter(r -> r.getCapacity() != null && r.getCapacity() >= section.getStudentStrength())
                .findFirst()
                .orElse(null);
    }

    private boolean placeTheorySlot(Subject subject, Faculty faculty, Section section, Resource room,
            Semester semester, String session) {
        for (String day : DAYS) {
            for (int slot = 1; slot <= TOTAL_SLOTS; slot++) {
                if (isFacultyFree(faculty.getId(), day, slot)
                        && isRoomFree(room.getId(), day, slot)
                        && isSectionFree(section.getId(), day, slot)) {

                    TimetableEntry entry = new TimetableEntry();
                    entry.setSection(section);
                    entry.setSubject(subject);
                    entry.setFaculty(faculty);
                    entry.setRoom(room);
                    entry.setSemester(semester);
                    entry.setSession(session);
                    entry.setDayOfWeek(day);
                    entry.setSlotNumber(slot);
                    entry.setLocked(false);
                    entryRepo.save(entry);
                    return true;
                }
            }
        }
        return false;
    }

    private boolean placeLabSession(Subject subject, Faculty faculty, Section section, Resource room,
            Semester semester, String session) {
        for (String day : DAYS) {
            for (int slot = 1; slot < TOTAL_SLOTS; slot++) {
                int next = slot + 1;
                if (isFacultyFree(faculty.getId(), day, slot) && isFacultyFree(faculty.getId(), day, next)
                        && isRoomFree(room.getId(), day, slot) && isRoomFree(room.getId(), day, next)
                        && isSectionFree(section.getId(), day, slot) && isSectionFree(section.getId(), day, next)) {

                    TimetableEntry e1 = new TimetableEntry();
                    e1.setSection(section);
                    e1.setSubject(subject);
                    e1.setFaculty(faculty);
                    e1.setRoom(room);
                    e1.setSemester(semester);
                    e1.setSession(session);
                    e1.setDayOfWeek(day);
                    e1.setSlotNumber(slot);
                    e1.setLocked(false);
                    entryRepo.save(e1);

                    TimetableEntry e2 = new TimetableEntry();
                    e2.setSection(section);
                    e2.setSubject(subject);
                    e2.setFaculty(faculty);
                    e2.setRoom(room);
                    e2.setSemester(semester);
                    e2.setSession(session);
                    e2.setDayOfWeek(day);
                    e2.setSlotNumber(next);
                    e2.setLocked(false);
                    entryRepo.save(e2);

                    return true;
                }
            }
        }
        return false;
    }

    public boolean isFacultyFree(Long facultyId, String day, int slot) {
        return !entryRepo.existsByFacultyIdAndDayOfWeekAndSlotNumber(facultyId, day, slot);
    }

    public boolean isRoomFree(Long roomId, String day, int slot) {
        return !entryRepo.existsByRoomIdAndDayOfWeekAndSlotNumber(roomId, day, slot);
    }

    public boolean isSectionFree(Long sectionId, String day, int slot) {
        return !entryRepo.existsBySectionIdAndDayOfWeekAndSlotNumber(sectionId, day, slot);
    }

    public TimetableGenerationService(AllocationRepository allocationRepository, TimetableEntryRepository entryRepo, ResourceRepository resourceRepo) {
        this.allocationRepository = allocationRepository;
        this.entryRepo = entryRepo;
        this.resourceRepo = resourceRepo;
    }
}