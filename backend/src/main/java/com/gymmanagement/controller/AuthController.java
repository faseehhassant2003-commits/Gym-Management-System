package com.gymmanagement.controller;

import com.gymmanagement.dto.LoginRequest;
import com.gymmanagement.dto.LoginResponse;
import com.gymmanagement.dto.RegisterRequest;
import com.gymmanagement.dto.RegisterResponse;
import com.gymmanagement.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return authService.login(request);

    }

    @PostMapping("/register")
    public RegisterResponse register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);

    }

}