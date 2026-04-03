package com.authservice.auth.service;

import com.authservice.auth.dto.RegisterRequest;
import com.authservice.auth.dto.LoginRequest;
import com.authservice.auth.model.User;
import com.authservice.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return "User registered successfully!";
    }

    @Override
    public String login(LoginRequest request) {

        User existingUser = userRepository.findByUsername(request.getUsername());

        if (existingUser != null &&
                passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            return "User authenticated";
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}