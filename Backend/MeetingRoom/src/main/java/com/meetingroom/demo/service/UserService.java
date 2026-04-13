package com.meetingroom.demo.service;

import com.meetingroom.demo.model.Booking;
import com.meetingroom.demo.model.User;
import com.meetingroom.demo.repository.BookingRepository;
import com.meetingroom.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Integer userId) {
        return userRepository.findById(userId);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void deleteById(Integer userId) {
        userRepository.deleteById(userId);
    }

    public List<Booking> findBookingsByUserId(Integer userId) {
        return bookingRepository.findByUser_UserID(userId);
    }

    public List<Booking> findActiveBookingsByUserId(Integer userId) {
        return bookingRepository.findByUser_UserID(userId)
                .stream()
                .filter(booking -> booking.getEndDateTime().isAfter(LocalDateTime.now()))
                .toList();
    }

    public boolean hasActiveBookings(Integer userId) {
        return bookingRepository.findByUser_UserID(userId)
                .stream()
                .anyMatch(booking -> booking.getEndDateTime().isAfter(LocalDateTime.now()));
    }
}
