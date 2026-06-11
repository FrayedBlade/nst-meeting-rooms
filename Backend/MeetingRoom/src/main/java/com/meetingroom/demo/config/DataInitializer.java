package com.meetingroom.demo.config;

import com.meetingroom.demo.model.Role;
import com.meetingroom.demo.model.User;
import com.meetingroom.demo.repository.RoleRepository;
import com.meetingroom.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${admin.default.password:Admin1234!}")
    private String adminDefaultPassword;

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(createRole("ROLE_ADMIN")));

        roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(createRole("ROLE_USER")));

        if (userRepository.findByEmail("admin@meetingroom.com").isEmpty()) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setPersonalID("0000000000000");
            admin.setEmail("admin@meetingroom.com");
            admin.setPassword(passwordEncoder.encode(adminDefaultPassword));
            admin.setRole(adminRole);
            userRepository.save(admin);
        }
    }

    private Role createRole(String name) {
        Role role = new Role();
        role.setName(name);
        return role;
    }
}
