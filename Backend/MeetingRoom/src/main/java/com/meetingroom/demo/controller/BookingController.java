package com.meetingroom.demo.controller;

import com.meetingroom.demo.model.Booking;
import com.meetingroom.demo.service.BookingService;
import com.meetingroom.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

//test1 

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

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
    public ResponseEntity<?> addBooking(@Valid @RequestBody Booking booking) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            var caller = userService.findByEmail(auth.getName()).orElse(null);
            if (caller == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            booking.setUser(caller);
            booking.setStatus("PENDING");
        } else {
            booking.setStatus("APPROVED");
        }

        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.save(booking));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Integer id, @Valid @RequestBody Booking updated) {
        Optional<Booking> existingOpt = bookingService.findById(id);
        if (existingOpt.isEmpty()) return ResponseEntity.notFound().build();
        Booking existing = existingOpt.get();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            if (!existing.getUser().getEmail().equals(auth.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            updated.setUser(existing.getUser());
            updated.setStatus("PENDING");
        }

        updated.setBookingID(id);
        try {
            return ResponseEntity.ok(bookingService.save(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Integer id) {
        Optional<Booking> existingOpt = bookingService.findById(id);
        if (existingOpt.isEmpty()) return ResponseEntity.notFound().build();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !existingOpt.get().getUser().getEmail().equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        bookingService.deleteById(id);
        return ResponseEntity.noContent().build();
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

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(bookingService.updateStatus(id, "APPROVED"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(bookingService.updateStatus(id, "REJECTED"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
