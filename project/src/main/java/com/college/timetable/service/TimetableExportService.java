// src/main/java/com/college/timetable/service/TimetableExportService.java
package com.college.timetable.service;

import com.college.timetable.model.TimetableEntry;
import com.college.timetable.repository.TimetableEntryRepository;

// Explicit PDF Imports (Avoids wildcard star collision)
import com.lowagie.text.Document;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

// Explicit Excel Imports 
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class TimetableExportService {

    @Autowired
    private TimetableEntryRepository entryRepo;

    private static final String[] DAYS = { "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY" };
    private static final int TOTAL_SLOTS = 8;

    public byte[] generatePdf(Long sectionId) throws Exception {
        List<TimetableEntry> entries = entryRepo.findBySectionId(sectionId);

        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        document.add(new Paragraph("Timetable - Section ID: " + sectionId));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(DAYS.length + 1);
        table.addCell("Slot");
        for (String day : DAYS)
            table.addCell(day);

        for (int slot = 1; slot <= TOTAL_SLOTS; slot++) {
            table.addCell("Slot " + slot);
            for (String day : DAYS) {
                String cellText = "-";
                for (TimetableEntry entry : entries) {
                    if (entry.getDayOfWeek().equals(day) && entry.getSlotNumber() == slot) {
                        cellText = entry.getSubject().getSubjectCode() + " / " + entry.getRoom().getRoomNumber();
                    }
                }
                table.addCell(cellText);
            }
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }

    public byte[] generateExcel(Long sectionId) throws Exception {
        List<TimetableEntry> entries = entryRepo.findBySectionId(sectionId);

        XSSFWorkbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Timetable");

        CellStyle headerStyle = workbook.createCellStyle();
        org.apache.poi.ss.usermodel.Font font = workbook.createFont();
        font.setBold(true);
        headerStyle.setFont(font);

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Slot");
        for (int i = 0; i < DAYS.length; i++) {
            Cell cell = headerRow.createCell(i + 1);
            cell.setCellValue(DAYS[i]);
            cell.setCellStyle(headerStyle);
        }

        for (int slot = 1; slot <= TOTAL_SLOTS; slot++) {
            Row row = sheet.createRow(slot);
            row.createCell(0).setCellValue("Slot " + slot);

            for (int d = 0; d < DAYS.length; d++) {
                String cellText = "-";
                for (TimetableEntry entry : entries) {
                    if (entry.getDayOfWeek().equals(DAYS[d]) && entry.getSlotNumber() == slot) {
                        cellText = entry.getSubject().getSubjectCode() + " / " + entry.getRoom().getRoomNumber();
                    }
                }
                row.createCell(d + 1).setCellValue(cellText);
            }
        }

        for (int i = 0; i <= DAYS.length; i++)
            sheet.autoSizeColumn(i);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();
        return out.toByteArray();
    }
}