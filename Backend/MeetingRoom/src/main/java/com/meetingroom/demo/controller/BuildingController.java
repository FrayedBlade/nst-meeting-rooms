package com.meetingroom.demo.controller;

import com.meetingroom.demo.model.Building;
import com.meetingroom.demo.service.BuildingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/building")
public class BuildingController {

    @Autowired
    private BuildingService buildingService;

    @GetMapping
    public List<Building> getAllBuildings() {
        return buildingService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Building> getBuildingById(@PathVariable Integer id) {
        return buildingService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Building createBuilding(@Valid @RequestBody Building building) {
        return buildingService.save(building);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Building> updateBuilding(@PathVariable Integer id, @Valid @RequestBody Building updatedBuilding) {
        Optional<Building> existing = buildingService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Building building = existing.get();
        building.setName(updatedBuilding.getName());
        building.setAddress(updatedBuilding.getAddress());
        building.setNumberOfFloors(updatedBuilding.getNumberOfFloors());

        return ResponseEntity.ok(buildingService.save(building));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBuilding(@PathVariable Integer id) {
        buildingService.deleteById(id);
    }
}
