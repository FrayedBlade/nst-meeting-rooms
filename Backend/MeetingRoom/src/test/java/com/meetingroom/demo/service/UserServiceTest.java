package com.meetingroom.demo.service;

import com.meetingroom.demo.model.Booking;
import com.meetingroom.demo.model.Room;
import com.meetingroom.demo.model.User;
import com.meetingroom.demo.repository.BookingRepository;
import com.meetingroom.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserID(1);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPersonalID("1234567890123");
        user.setEmail("john@example.com");
        user.setPhone("0612345678");
    }

    @Test
    void findAll_ShouldReturnAllUsers() {
        User user2 = new User();
        user2.setUserID(2);
        user2.setFirstName("Jane");
        user2.setLastName("Doe");

        when(userRepository.findAll()).thenReturn(Arrays.asList(user, user2));

        List<User> result = userService.findAll();

        assertEquals(2, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void findById_WhenExists_ShouldReturnUser() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        Optional<User> result = userService.findById(1);

        assertTrue(result.isPresent());
        assertEquals("John", result.get().getFirstName());
    }

    @Test
    void findById_WhenNotExists_ShouldReturnEmpty() {
        when(userRepository.findById(99)).thenReturn(Optional.empty());

        Optional<User> result = userService.findById(99);

        assertFalse(result.isPresent());
    }

    @Test
    void save_ShouldReturnSavedUser() {
        when(userRepository.save(any(User.class))).thenReturn(user);

        User saved = userService.save(user);

        assertNotNull(saved);
        assertEquals("John", saved.getFirstName());
        verify(userRepository).save(user);
    }

    @Test
    void deleteById_ShouldCallRepository() {
        doNothing().when(userRepository).deleteById(1);

        userService.deleteById(1);

        verify(userRepository).deleteById(1);
    }

    @Test
    void findBookingsByUserId_ShouldReturnBookings() {
        Room room = new Room();
        room.setRoomID(1);

        Booking booking = new Booking();
        booking.setBookingID(1);
        booking.setUser(user);
        booking.setRoom(room);
        booking.setStartDateTime(LocalDateTime.now().plusDays(1));
        booking.setEndDateTime(LocalDateTime.now().plusDays(1).plusHours(2));

        when(bookingRepository.findByUser_UserID(1)).thenReturn(List.of(booking));

        List<Booking> result = userService.findBookingsByUserId(1);

        assertEquals(1, result.size());
    }

    @Test
    void hasActiveBookings_WithActiveBooking_ShouldReturnTrue() {
        Booking activeBooking = new Booking();
        activeBooking.setBookingID(1);
        activeBooking.setUser(user);
        activeBooking.setStartDateTime(LocalDateTime.now().minusHours(1));
        activeBooking.setEndDateTime(LocalDateTime.now().plusHours(1));

        when(bookingRepository.findByUser_UserID(1)).thenReturn(List.of(activeBooking));

        assertTrue(userService.hasActiveBookings(1));
    }

    @Test
    void hasActiveBookings_WithNoActiveBooking_ShouldReturnFalse() {
        Booking pastBooking = new Booking();
        pastBooking.setBookingID(1);
        pastBooking.setUser(user);
        pastBooking.setStartDateTime(LocalDateTime.now().minusDays(2));
        pastBooking.setEndDateTime(LocalDateTime.now().minusDays(1));

        when(bookingRepository.findByUser_UserID(1)).thenReturn(List.of(pastBooking));

        assertFalse(userService.hasActiveBookings(1));
    }
}
