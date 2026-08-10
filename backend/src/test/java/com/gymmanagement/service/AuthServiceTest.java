package com.gymmanagement.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymmanagement.dto.LoginRequest;
import com.gymmanagement.dto.LoginResponse;
import com.gymmanagement.dto.RegisterRequest;
import com.gymmanagement.dto.RegisterResponse;
import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.User;
import com.gymmanagement.enums.Role;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.repository.OtpRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private OtpRepository otpRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerResponseDoesNotExposeTokenField() throws JsonProcessingException {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("user@example.com");
        request.setPassword("secret123");
        request.setName("Alice");
        request.setPhone("1234567890");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");
        when(memberRepository.save(any(Member.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RegisterResponse response = authService.register(request);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(response);

        assertTrue(response.isSuccess());
        assertTrue(json.contains("\"success\":true"));
        assertFalse(json.contains("\"token\""));
    }

    @Test
    void loginResponseUsesQrTokenField() throws JsonProcessingException {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("secret123");

        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("encoded-password");
        user.setRole(Role.MEMBER);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "encoded-password")).thenReturn(true);
        when(jwtService.generateToken("user@example.com", "auth")).thenReturn("auth-jwt-token");

        LoginResponse response = authService.login(request);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(response);

        assertTrue(response.isSuccess());
        assertEquals("auth-jwt-token", response.getToken());
        assertTrue(json.contains("\"token\":\"auth-jwt-token\""));
    }
}
