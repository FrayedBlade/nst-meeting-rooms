package com.meetingroom.demo.service;

import com.meetingroom.demo.model.Booking;
import com.meetingroom.demo.model.Room;
import com.meetingroom.demo.model.User;
import com.meetingroom.demo.repository.BookingRepository;
import com.meetingroom.demo.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingService bookingService;

    private Booking booking;
    private User user;
    private Room room;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserID(1);
        user.setFirstName("John");
        user.setLastName("Doe");

        room = new Room();
        room.setRoomID(1);
        room.setRoomName("Conference Room A");
        room.setRoomNumber("RM0001");
        room.setCapacity(10);

        booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setStartDateTime(LocalDateTime.now().plusDays(1));
        booking.setEndDateTime(LocalDateTime.now().plusDays(1).plusHours(2));
    }

    @Test
    void findAll_ShouldReturnAllBookings() {
        when(bookingRepository.findAll()).thenReturn(List.of(booking));

        List<Booking> result = bookingService.findAll();

        assertEquals(1, result.size());
        verify(bookingRepository).findAll();
    }

    @Test
    void findById_ShouldReturnBooking() {
        booking.setBookingID(1);
        when(bookingRepository.findById(1)).thenReturn(Optional.of(booking));

        Optional<Booking> result = bookingService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getBookingID());
    }

    @Test
    void save_ValidBooking_ShouldSucceed() {
        when(roomRepository.findById(1)).thenReturn(Optional.of(room));
        when(bookingRepository.findOverlappingBookings(anyInt(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking result = bookingService.save(booking);

        assertNotNull(result);
        verify(bookingRepository).save(booking);
    }

    @Test
    void save_EndTimeBeforeStartTime_ShouldThrowException() {
        booking.setEndDateTime(LocalDateTime.now().minusDays(1));
        booking.setStartDateTime(LocalDateTime.now().plusDays(1));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.save(booking)
        );

        assertEquals("End time must be after start time", exception.getMessage());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void save_RoomNotFound_ShouldThrowException() {
        when(roomRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> bookingService.save(booking));
    }

    @Test
    void save_OverlappingBooking_ShouldThrowException() {
        Booking existing = new Booking();
        existing.setBookingID(99);

        when(roomRepository.findById(1)).thenReturn(Optional.of(room));
        when(bookingRepository.findOverlappingBookings(anyInt(), any(), any()))
                .thenReturn(List.of(existing));

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> bookingService.save(booking)
        );

        assertEquals("Room is already booked for the selected time period", exception.getMessage());
    }

    @Test
    void save_UpdateExistingBooking_ShouldExcludeSelfFromOverlapCheck() {
        booking.setBookingID(1);
        Booking overlapping = new Booking();
        overlapping.setBookingID(1); // same booking

        when(roomRepository.findById(1)).thenReturn(Optional.of(room));
        when(bookingRepository.findOverlappingBookings(anyInt(), any(), any()))
                .thenReturn(List.of(overlapping));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking result = bookingService.save(booking);

        assertNotNull(result);
        verify(bookingRepository).save(booking);
    }

    @Test
    void deleteById_ShouldCallRepository() {
        doNothing().when(bookingRepository).deleteById(1);

        bookingService.deleteById(1);

        verify(bookingRepository).deleteById(1);
    }

    @Test
    void findByUserId_ShouldReturnBookings() {
        when(bookingRepository.findByUser_UserID(1)).thenReturn(List.of(booking));

        List<Booking> result = bookingService.findByUserId(1);

        assertEquals(1, result.size());
    }

    @Test
    void findByRoomId_ShouldReturnBookings() {
        when(bookingRepository.findByRoom_RoomID(1)).thenReturn(List.of(booking));

        List<Booking> result = bookingService.findByRoomId(1);

        assertEquals(1, result.size());
    }
}
