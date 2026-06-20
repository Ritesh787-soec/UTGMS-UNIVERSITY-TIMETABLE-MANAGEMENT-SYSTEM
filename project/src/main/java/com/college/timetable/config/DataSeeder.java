// src/main/java/com/college/timetable/config/DataSeeder.java
package com.college.timetable.config;

import com.college.timetable.model.User;
import com.college.timetable.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@college.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@college.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Default admin created -> admin@college.com / admin123");
        }
    }
}