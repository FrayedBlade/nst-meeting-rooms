package com.meetingroom.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Table(name = "[User]")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "Up to 50 characters")
    @Column(name = "FirstName")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Up to 50 characters")
    @Column(name = "LastName")
    private String lastName;

    @NotBlank(message = "Personal ID is required")
    @Size(min = 13, max = 13, message = "Personal ID must be exactly 13 characters")
    @Column(nullable = false, length = 13, unique = true)
    private String personalID;

    @Email(message = "Email must be valid")
    @Column(unique = true, length = 100)
    @Size(max = 100, message = "Up to 100 characters")
    private String email;

    @Size(max = 10, message = "Phone number can be up to 10 digits")
    @Pattern(regexp = "^[0-9]+$", message = "Phone number must contain digits only")
    @Column(length = 10)
    private String phone;

    @CreationTimestamp
    @Column(updatable = false, name = "RegistrationDate")
    private LocalDate registrationDate;
}
