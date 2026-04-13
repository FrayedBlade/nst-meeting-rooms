package com.meetingroom.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Room")
@Data
@NoArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roomID;

    @NotBlank(message = "Room name is required.")
    @Size(max = 100, message = "Room name can be up to 100 characters.")
    @Column(nullable = false, length = 100)
    private String roomName;

    @NotBlank(message = "Room number is required.")
    @Size(min = 6, max = 6, message = "Room number must be exactly 6 characters.")
    @Column(nullable = false, unique = true, length = 6)
    private String roomNumber;

    @Size(max = 100, message = "Location can be up to 100 characters.")
    @Column(length = 100)
    private String location;

    @Min(value = 1, message = "Capacity must be at least 1.")
    @Max(value = 100, message = "Capacity cannot exceed 100.")
    @Column(nullable = false)
    private Integer capacity;
}
