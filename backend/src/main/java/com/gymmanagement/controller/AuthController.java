package com.gymmanagement.controller;

import com.gymmanagement.dto.*;
import com.gymmanagement.service.AuthService;
import com.gymmanagement.service.OtpService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    public AuthController(
            AuthService authService,
            OtpService otpService) {

        this.authService = authService;
        this.otpService = otpService;
    }

    @PostMapping("/send-otp")
    public String sendOtp(
            @RequestBody RegisterOtpRequest request) throws IOException {

        otpService.sendOtp(request.getEmail());

        return "OTP Sent Successfully";
    }

    @PostMapping("/verify-otp")
    public RegisterResponse verifyOtp(
            @RequestBody CompleteRegistrationRequest request) {

        boolean verified = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        if (!verified) {
            return new RegisterResponse(
                    false,
                    "Invalid or Expired OTP"
            );
        }

        return authService.completeRegistration(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @PostMapping("/register")
    public RegisterResponse register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }
}