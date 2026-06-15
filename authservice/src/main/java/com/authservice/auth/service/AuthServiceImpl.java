package com.authservice.auth.service;

import com.authservice.auth.dto.RegisterRequest;
import com.authservice.auth.dto.LoginRequest;
import com.authservice.auth.model.User;
import com.authservice.auth.repository.UserRepository;
import com.authservice.auth.config.JwtUtil;
import com.authservice.auth.exception.UserAlreadyExistsException;
import com.authservice.auth.exception.InvalidCredentialsException;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MeterRegistry meterRegistry;

    // Metrics counters for monitoring auth events
    private final Counter loginSuccessCounter;
    private final Counter loginFailureCounter;
    private final Counter signupCounter;

    private static final Logger logger =
            LoggerFactory.getLogger(AuthServiceImpl.class);

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           MeterRegistry meterRegistry) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.meterRegistry = meterRegistry;

        // Successful login counter
        this.loginSuccessCounter =
                Counter.builder("auth.login.success")
                        .description("Successful logins")
                        .register(meterRegistry);

        // Failed login counter
        this.loginFailureCounter =
                Counter.builder("auth.login.failure")
                        .description("Failed logins")
                        .register(meterRegistry);

        // Signup counter
        this.signupCounter =
                Counter.builder("auth.signup.success")
                        .description("Successful registrations")
                        .register(meterRegistry);
    }

    @Override
    public String register(RegisterRequest request) {

        // Prevent duplicate user registration
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        logger.info("New user registered {}", request.getEmail());
        signupCounter.increment();

        return "User registered successfully!";
    }

    @Override
    public String login(LoginRequest request) {

        User existingUser =
                userRepository.findByEmail(request.getEmail());

        // User not found
        if (existingUser == null) {
            loginFailureCounter.increment();
            logger.warn("Login failed - user not found {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Validate password
        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        existingUser.getPassword()
                );

        if (!passwordMatches) {
            loginFailureCounter.increment();
            logger.warn("Failed login attempt for {}", existingUser.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Successful login
        loginSuccessCounter.increment();
        logger.info("Login successful for {}", existingUser.getEmail());
         return jwtUtil.generateToken(existingUser.getEmail());
    }
}