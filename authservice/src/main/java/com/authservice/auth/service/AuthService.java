package com.authservice.auth.service;

import com.authservice.auth.dto.RegisterRequest;
import com.authservice.auth.dto.LoginRequest;
public interface AuthService {
    String register(RegisterRequest request);
    String login(LoginRequest request);

}