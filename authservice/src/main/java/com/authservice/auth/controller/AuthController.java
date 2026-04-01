package com.authservice.auth.controller;

import com.authservice.auth.model.User;
import com.authservice.auth.dto.LoginRequest;
import com.authservice.auth.dto.RegisterRequest;
import com.authservice.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import com.authservice.auth.service.AuthService;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/auth")
public class AuthController {

    
    

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        
        return ResponseEntity.ok(authService.register(request));
            
    
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        System.out.println("LOGIN API CALLED");
        return ResponseEntity.ok(authService.login(request));
    }
}
