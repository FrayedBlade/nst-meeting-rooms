package com.meetingroom.demo.controller;

import com.meetingroom.demo.model.Room;
import com.meetingroom.demo.service.RoomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoomController.class)
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoomService roomService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void getAllRooms_ShouldReturnRoomList() throws Exception {
        Room room2 = new Room();
        room2.setRoomID(2);
        room2.setRoomName("Conference Room B");
        room2.setRoomNumber("RM0002");
        room2.setLocation("Floor 2");
        room2.setCapacity(20);

        when(roomService.findAll()).thenReturn(Arrays.asList(room, room2));

        mockMvc.perform(get("/room"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].roomName", is("Conference Room A")))
                .andExpect(jsonPath("$[1].roomName", is("Conference Room B")));
    }

    @Test
    void getRoomById_WhenExists_ShouldReturnRoom() throws Exception {
        when(roomService.findById(1)).thenReturn(Optional.of(room));

        mockMvc.perform(get("/room/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomName", is("Conference Room A")))
                .andExpect(jsonPath("$.roomNumber", is("RM0001")));
    }

    @Test
    void createRoom_WithValidData_ShouldReturnCreatedRoom() throws Exception {
        when(roomService.save(any(Room.class))).thenReturn(room);

        Room newRoom = new Room();
        newRoom.setRoomName("Conference Room A");
        newRoom.setRoomNumber("RM0001");
        newRoom.setLocation("Floor 1");
        newRoom.setCapacity(10);

        mockMvc.perform(post("/room")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newRoom)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.roomName", is("Conference Room A")));
    }

    @Test
    void createRoom_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        Room invalid = new Room();
        // Missing required fields

        mockMvc.perform(post("/room")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateRoom_WhenExists_ShouldReturnUpdatedRoom() throws Exception {
        Room updated = new Room();
        updated.setRoomName("Updated Room");
        updated.setRoomNumber("RM0001");
        updated.setLocation("Floor 2");
        updated.setCapacity(15);

        when(roomService.findById(1)).thenReturn(Optional.of(room));
        when(roomService.save(any(Room.class))).thenReturn(updated);

        mockMvc.perform(put("/room/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomName", is("Updated Room")));
    }

    @Test
    void deleteRoom_ShouldReturnNoContent() throws Exception {
        doNothing().when(roomService).deleteById(1);

        mockMvc.perform(delete("/room/1"))
                .andExpect(status().isNoContent());

        verify(roomService).deleteById(1);
    }
}
