package com.college.timetable.repository;

import com.college.timetable.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // JPQL uses the Java field names: 'type' and 'status'
    @Query("SELECT r FROM Resource r WHERE r.type = :type AND r.status = 'Active'")
    List<Resource> findByTypeAndIsActiveTrue(@Param("type") String type);
}