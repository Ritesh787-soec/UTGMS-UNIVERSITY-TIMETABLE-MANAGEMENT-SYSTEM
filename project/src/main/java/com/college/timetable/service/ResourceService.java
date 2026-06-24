package com.college.timetable.service;

import com.college.timetable.model.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceService {
    public List<Resource> getAll() {
        return java.util.Collections.emptyList();
    }

    public Resource getById(Long id) {
        return null;
    }

    public Resource create(Object request) {
        return null;
    }

    public Resource update(Long id, Object request) {
        return null;
    }

    public void delete(Long id) {
    }

    public Resource toggleActive(Long id) {
        return null;
    }
}