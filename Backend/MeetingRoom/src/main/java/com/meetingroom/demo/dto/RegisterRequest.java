package com.meetingroom.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50)
    private String lastName;

    @NotBlank(message = "Personal ID is required")
    @Size(min = 13, max = 13, message = "Personal ID must be exactly 13 characters")
    private String personalID;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100)
    private String email;

    @Size(max = 10)
    @Pattern(regexp = "^[0-9]*$", message = "Phone number must contain digits only")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPersonalID() { return personalID; }
    public void setPersonalID(String personalID) { this.personalID = personalID; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
