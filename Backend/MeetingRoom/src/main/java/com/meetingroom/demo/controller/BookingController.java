package com.meetingroom.demo.controller;

import com.meetingroom.demo.model.Booking;
import com.meetingroom.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public Optional<Booking> getBookingById(@PathVariable Integer id) {
        return bookingService.findById(id);
    }

    @PostMapping
    public Booking addBooking(@RequestBody Booking booking) {
        return bookingService.save(booking);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Integer id, @RequestBody Booking updated) {
        updated.setBookingID(id);
        return bookingService.save(updated);
    }

    @DeleteMapping("/{id}")
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
