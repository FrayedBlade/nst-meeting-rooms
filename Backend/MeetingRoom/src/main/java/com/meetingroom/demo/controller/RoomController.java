package com.meetingroom.demo.controller;

import com.meetingroom.demo.model.Room;
import com.meetingroom.demo.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/room")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.findAll();
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Integer id) {
        return roomService.findById(id).orElse(null);
    }

    @PostMapping
    public Room createRoom(@Valid @RequestBody Room room) {
        return roomService.save(room);
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Integer id, @Valid @RequestBody Room updatedRoom) {
        Optional<Room> existing = roomService.findById(id);
        if (existing.isEmpty()) {
            return null;
        }

        Room room = existing.get();
        room.setRoomName(updatedRoom.getRoomName());
        room.setRoomNumber(updatedRoom.getRoomNumber());
        room.setLocation(updatedRoom.getLocation());
        room.setCapacity(updatedRoom.getCapacity());

        return roomService.save(room);
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Integer id) {
        roomService.deleteById(id);
    }
}
