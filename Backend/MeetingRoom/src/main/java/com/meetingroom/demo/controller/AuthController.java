package com.meetingroom.demo.controller;

import com.meetingroom.demo.dto.AuthResponse;
import com.meetingroom.demo.dto.LoginRequest;
import com.meetingroom.demo.dto.RegisterRequest;
import com.meetingroom.demo.model.Role;
import com.meetingroom.demo.model.User;
import com.meetingroom.demo.security.JwtService;
import com.meetingroom.demo.service.RoleService;
import com.meetingroom.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        Role userRole = roleService.findByName("ROLE_USER")
                .orElse(null);

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPersonalID(request.getPersonalID());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);

        User saved = userService.save(user);
        String roleName = saved.getRole() != null ? saved.getRole().getName() : "ROLE_USER";
        String token = jwtService.generateToken(saved.getEmail(), roleName);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(token, saved.getEmail(), roleName));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            String email = authentication.getName();
            String role = authentication.getAuthorities().iterator().next().getAuthority();
            String token = jwtService.generateToken(email, role);

            return ResponseEntity.ok(new AuthResponse(token, email, role));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
    }
}
