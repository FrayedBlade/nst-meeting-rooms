package com.meetingroom.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roleID;

    @NotBlank(message = "Role name is required.")
    @Size(max = 50, message = "Role name can be up to 50 characters.")
    @Column(nullable = false, unique = true, length = 50)
    private String name;
}
