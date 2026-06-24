package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "resources")
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resource_id")
    private Long id;

    @Column(name = "resource_name", nullable = false)
    private String name;

    @Column(name = "resource_type")
    private String type; // Classroom, Computer Lab, etc.

    private Integer capacity;
    private String status = "Active";

    // Standard Boilerplate: Generate Getters and Setters here
    public String getRoomNumber() {
        return this.name;
    }

    public void setRoomNumber(String roomNumber) {
        this.name = roomNumber;
    }
}