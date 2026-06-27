package com.college.timetable.model;

import jakarta.persistence.*;

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

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCapacity() {
        return this.capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Resource() {
    }

    public Resource(Long id, String name, String type, Integer capacity, String status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.status = status;
    }
}