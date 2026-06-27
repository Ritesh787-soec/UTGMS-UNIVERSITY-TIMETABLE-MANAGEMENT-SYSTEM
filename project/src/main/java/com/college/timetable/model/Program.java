// src/main/java/com/college/timetable/model/Program.java
package com.college.timetable.model;

import jakarta.persistence.*;

@Entity

public class Program {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

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

    public Department getDepartment() {
        return this.department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Program() {
    }

    public Program(Long id, String name, Department department) {
        this.id = id;
        this.name = name;
        this.department = department;
    }
}