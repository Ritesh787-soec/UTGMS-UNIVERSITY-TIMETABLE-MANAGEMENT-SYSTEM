package com.college.timetable;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class TimetableApplication {

    @PostConstruct
    public void init() {
        // This explicitly forces the JVM and JDBC driver to use Kolkata over Calcutta
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }

    public static void main(String[] args) {
        SpringApplication.run(TimetableApplication.class, args);
    }
}