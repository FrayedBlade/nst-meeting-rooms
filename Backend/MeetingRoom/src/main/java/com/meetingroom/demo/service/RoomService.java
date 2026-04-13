package com.meetingroom.demo.service;

import com.meetingroom.demo.model.Room;
import com.meetingroom.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    public Optional<Room> findById(Integer roomId) {
        return roomRepository.findById(roomId);
    }

    public Room save(Room room) {
        return roomRepository.save(room);
    }

    public void deleteById(Integer roomId) {
        roomRepository.deleteById(roomId);
    }
}
