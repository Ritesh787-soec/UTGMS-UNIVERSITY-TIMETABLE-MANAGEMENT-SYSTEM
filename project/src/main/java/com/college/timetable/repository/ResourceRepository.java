// src/main/java/com/college/timetable/repository/ResourceRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    @Query("SELECT r FROM Resource r WHERE r.active = true")
    List<Resource> findByIsActiveTrue();

    @Query("SELECT r FROM Resource r WHERE r.type = :type AND r.active = true")
    List<Resource> findByTypeAndIsActiveTrue(@Param("type") String type);
}