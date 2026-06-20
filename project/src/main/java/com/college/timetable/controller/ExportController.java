// src/main/java/com/college/timetable/controller/ExportController.java
package com.college.timetable.controller;

import com.college.timetable.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/export")
public class ExportController {
    private final ExportService exportService;

    @GetMapping("/pdf")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> exportPdf(@RequestParam Long sectionId) {
        byte[] pdf = exportService.generatePdf(sectionId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=timetable.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/excel")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<byte[]> exportExcel(@RequestParam Long sectionId) {
        byte[] excel = exportService.generateExcel(sectionId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=timetable.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}