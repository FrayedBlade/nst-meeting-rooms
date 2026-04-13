package com.meetingroom.demo.controller;

import com.meetingroom.demo.model.Booking;
import com.meetingroom.demo.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Integer id) {
        return bookingService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking addBooking(@Valid @RequestBody Booking booking) {
        return bookingService.save(booking);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Integer id, @Valid @RequestBody Booking updated) {
        if (bookingService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        updated.setBookingID(id);
        return ResponseEntity.ok(bookingService.save(updated));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBooking(@PathVariable Integer id) {
        bookingService.deleteById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Integer userId) {
        return bookingService.findByUserId(userId);
    }

    @GetMapping("/room/{roomId}")
    public List<Booking> getBookingsByRoom(@PathVariable Integer roomId) {
        return bookingService.findByRoomId(roomId);
    }

    @GetMapping("/active")
    public List<Booking> getAllActiveBookings() {
        return bookingService.findAllActiveBookings();
    }
}
