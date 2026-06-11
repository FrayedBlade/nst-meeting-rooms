package com.meetingroom.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "building")
@Data
@NoArgsConstructor
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer buildingID;

    @NotBlank(message = "Building name is required.")
    @Size(max = 100, message = "Building name can be up to 100 characters.")
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 150, message = "Address can be up to 150 characters.")
    @Column(length = 150)
    private String address;

    @Min(value = 1, message = "Number of floors must be at least 1.")
    @Column
    private Integer numberOfFloors;
}
