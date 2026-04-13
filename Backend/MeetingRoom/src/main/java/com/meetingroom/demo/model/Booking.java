package com.meetingroom.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Booking")
@Data
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "roomID", nullable = false)
    private Room room;

    @FutureOrPresent(message = "Start date and time cannot be in the past.")
    @NotNull(message = "Start date and time is required.")
    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @NotNull(message = "End date and time is required.")
    @Column(nullable = false)
    private LocalDateTime endDateTime;
}
