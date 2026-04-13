package com.meetingroom.demo.service;

import com.meetingroom.demo.model.Room;
import com.meetingroom.demo.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomService roomService;

    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room();
        room.setRoomID(1);
        room.setRoomName("Conference Room A");
        room.setRoomNumber("RM0001");
        room.setLocation("Floor 1");
        room.setCapacity(10);
    }

    @Test
    void findAll_ShouldReturnAllRooms() {
        Room room2 = new Room();
        room2.setRoomID(2);
        room2.setRoomName("Conference Room B");
        room2.setRoomNumber("RM0002");
        room2.setCapacity(20);

        when(roomRepository.findAll()).thenReturn(Arrays.asList(room, room2));

        List<Room> result = roomService.findAll();

        assertEquals(2, result.size());
        verify(roomRepository, times(1)).findAll();
    }

    @Test
    void findById_WhenRoomExists_ShouldReturnRoom() {
        when(roomRepository.findById(1)).thenReturn(Optional.of(room));

        Optional<Room> result = roomService.findById(1);

        assertTrue(result.isPresent());
        assertEquals("Conference Room A", result.get().getRoomName());
    }

    @Test
    void findById_WhenRoomDoesNotExist_ShouldReturnEmpty() {
        when(roomRepository.findById(99)).thenReturn(Optional.empty());

        Optional<Room> result = roomService.findById(99);

        assertFalse(result.isPresent());
    }

    @Test
    void save_ShouldReturnSavedRoom() {
        when(roomRepository.save(any(Room.class))).thenReturn(room);

        Room saved = roomService.save(room);

        assertNotNull(saved);
        assertEquals("Conference Room A", saved.getRoomName());
        verify(roomRepository, times(1)).save(room);
    }

    @Test
    void deleteById_ShouldCallRepository() {
        doNothing().when(roomRepository).deleteById(1);

        roomService.deleteById(1);

        verify(roomRepository, times(1)).deleteById(1);
    }
}
