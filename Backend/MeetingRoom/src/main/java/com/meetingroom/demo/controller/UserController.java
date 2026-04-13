package com.meetingroom.demo.controller;

import com.meetingroom.demo.model.Booking;
import com.meetingroom.demo.model.User;
import com.meetingroom.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.findById(id).orElse(null);
    }

    @PostMapping
    public User createUser(@Valid @RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Integer id, @Valid @RequestBody User updatedUser) {
        Optional<User> existing = userService.findById(id);
        if (existing.isEmpty()) {
            return null;
        }
        User user = existing.get();
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setPersonalID(updatedUser.getPersonalID());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());

        return userService.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteById(id);
    }

    @GetMapping("/{id}/bookings")
    public List<Booking> getBookings(@PathVariable Integer id) {
        return userService.findBookingsByUserId(id);
    }

    @GetMapping("/{id}/bookings/active")
    public List<Booking> getActiveBookings(@PathVariable Integer id) {
        return userService.findActiveBookingsByUserId(id);
    }

    @GetMapping("/{id}/bookings/active/exists")
    public boolean hasActiveBookings(@PathVariable Integer id) {
        return userService.hasActiveBookings(id);
    }
}
