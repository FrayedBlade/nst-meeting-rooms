package com.meetingroom.demo.service;

import com.meetingroom.demo.model.Building;
import com.meetingroom.demo.repository.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BuildingService {

    @Autowired
    private BuildingRepository buildingRepository;

    public List<Building> findAll() {
        return buildingRepository.findAll();
    }

    public Optional<Building> findById(Integer buildingId) {
        return buildingRepository.findById(buildingId);
    }

    public Building save(Building building) {
        return buildingRepository.save(building);
    }

    public void deleteById(Integer buildingId) {
        buildingRepository.deleteById(buildingId);
    }
}
