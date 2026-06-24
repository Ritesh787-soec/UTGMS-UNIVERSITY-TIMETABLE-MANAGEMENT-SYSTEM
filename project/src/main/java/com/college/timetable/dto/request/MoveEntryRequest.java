package com.college.timetable.dto.request;

import lombok.Data;

@Data
public class MoveEntryRequest {
    private String newDay;
    private int newSlot;
}