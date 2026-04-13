package com.meetingroom.demo.service;

import com.meetingroom.demo.model.Booking;
import com.meetingroom.demo.model.Room;
import com.meetingroom.demo.repository.BookingRepository;
import com.meetingroom.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> findById(Integer bookingId) {
        return bookingRepository.findById(bookingId);
    }

    public Booking save(Booking booking) {
        // Validate end time is after start time
        if (booking.getEndDateTime().isBefore(booking.getStartDateTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        // Load the room from DB
        Room room = roomRepository.findById(booking.getRoom().getRoomID())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        // Check for overlapping bookings
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                room.getRoomID(),
                booking.getStartDateTime(),
                booking.getEndDateTime()
        );

        // If updating an existing booking, exclude it from the overlap check
        if (booking.getBookingID() != null) {
            overlappingBookings = overlappingBookings.stream()
                    .filter(b -> !b.getBookingID().equals(booking.getBookingID()))
                    .toList();
        }

        if (!overlappingBookings.isEmpty()) {
            throw new IllegalStateException("Room is already booked for the selected time period");
        }

        // Replace stub room with managed entity
        booking.setRoom(room);

        return bookingRepository.save(booking);
    }

    public void deleteById(Integer bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    public List<Booking> findByUserId(Integer userId) {
        return bookingRepository.findByUser_UserID(userId);
    }

    public List<Booking> findByRoomId(Integer roomId) {
        return bookingRepository.findByRoom_RoomID(roomId);
    }

    public List<Booking> findAllActiveBookings() {
        return bookingRepository.findByEndDateTimeAfter(LocalDateTime.now());
    }
}
