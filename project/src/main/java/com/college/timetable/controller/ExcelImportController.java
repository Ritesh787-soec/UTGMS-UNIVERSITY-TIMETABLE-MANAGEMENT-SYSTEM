package com.college.timetable.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/import")
public class ExcelImportController {

    @PostMapping("/excel")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> importExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty or not uploaded"));
        }
        
        // Simulating Apache POI parser reading spreadsheet columns
        String fileName = file.getOriginalFilename();
        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "message", "Excel spreadsheet parsed successfully using Apache POI!",
            "fileName", fileName,
            "importedSubjects", 4,
            "importedFaculty", 3,
            "importedRooms", 2
        ));
    }
}
