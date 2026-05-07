package com.authservice.auth.service;

import com.authservice.auth.dto.RegisterRequest;
import com.authservice.auth.dto.LoginRequest;
import com.authservice.auth.model.User;
import com.authservice.auth.repository.UserRepository;
import com.authservice.auth.config.JwtUtil;
import com.authservice.auth.exception.UserAlreadyExistsException;
import com.authservice.auth.exception.InvalidCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return "User registered successfully!";
    }

    @Override
    public String login(LoginRequest request) {

        User existingUser =
            userRepository.findByEmail(request.getEmail());

    if (existingUser == null) {
        throw new InvalidCredentialsException("Invalid email or password");
    }

    boolean passwordMatches =
            passwordEncoder.matches(
                    request.getPassword(),
                    existingUser.getPassword()
            );

    if (!passwordMatches) {
         throw new InvalidCredentialsException("Invalid email or password");
    }
    
    return jwtUtil.generateToken(existingUser.getEmail());
    }


}