package com.college.timetable.controller;

import com.college.timetable.service.TimetableExportService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/export")
public class ExportController {

    private final TimetableExportService exportService;

    @GetMapping("/pdf")
    @PreAuthorize("isAuthenticated()")
    // ─── ADDED THROWS EXCEPTION HERE ───
    public ResponseEntity<byte[]> exportPdf(@RequestParam Long sectionId) throws Exception {
        byte[] pdf = exportService.generatePdf(sectionId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=timetable.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/excel")
    @PreAuthorize("hasRole('COORDINATOR')")
    // ─── ADDED THROWS EXCEPTION HERE ───
    public ResponseEntity<byte[]> exportExcel(@RequestParam Long sectionId) throws Exception {
        byte[] excel = exportService.generateExcel(sectionId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=timetable.xlsx")
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    public ExportController(TimetableExportService exportService) {
        this.exportService = exportService;
    }
}