// src/main/java/com/college/timetable/repository/UserRepository.java
package com.college.timetable.repository;

import com.college.timetable.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}