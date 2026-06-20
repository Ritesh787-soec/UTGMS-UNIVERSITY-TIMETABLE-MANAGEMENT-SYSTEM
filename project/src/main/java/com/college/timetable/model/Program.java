// src/main/java/com/college/timetable/model/Program.java
package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Program {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}