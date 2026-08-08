package com.gymmanagement.service;

import com.gymmanagement.security.JwtService;

import com.gymmanagement.dto.RegisterRequest;
import com.gymmanagement.dto.RegisterResponse;
import com.gymmanagement.entity.Member;
import com.gymmanagement.enums.Role;
import com.gymmanagement.repository.MemberRepository;

import com.gymmanagement.dto.LoginRequest;
import com.gymmanagement.dto.LoginResponse;
import com.gymmanagement.entity.User;
import com.gymmanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final MemberRepository memberRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            MemberRepository memberRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new LoginResponse(false, "Invalid email or password",null,null);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse(false, "Invalid email or password",null,null);
        }
        String token=jwtService.generateToken(user.getEmail());
        return new LoginResponse(true, "Login Successful",token,user.getRole().name());
    }
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new RegisterResponse(false, "Email already exists");
        }

        User user = new User();

        user.setEmail(request.getEmail());
        user.setUsername(request.getEmail()); // temporary
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.MEMBER);
        user.setEnabled(true);

        Member member = new Member();

        member.setName(request.getName());
        member.setPhone(request.getPhone());
        member.setAge(18);              // temporary default
        member.setMembership("Basic");  // temporary default

        member.setUser(user);

        memberRepository.save(member);

        return new RegisterResponse(
                true,
                "Registration Successful"
        );
    }
}