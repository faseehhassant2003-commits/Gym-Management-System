package com.gymmanagement.service;

import com.gymmanagement.dto.*;
import com.gymmanagement.security.JwtService;

import com.gymmanagement.entity.Member;
import com.gymmanagement.enums.Role;
import com.gymmanagement.repository.MemberRepository;

import com.gymmanagement.entity.User;
import com.gymmanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gymmanagement.entity.OtpVerification;
import com.gymmanagement.repository.OtpRepository;
import java.util.UUID;
@Service
public class AuthService {
    private final MemberRepository memberRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpRepository otpRepository;

    public AuthService(
            UserRepository userRepository,
            MemberRepository memberRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            OtpRepository otpRepository) {

        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpRepository = otpRepository;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new LoginResponse(false, "Invalid email or password", null, null);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse(false, "Invalid email or password", null, null);
        }

        String authToken = jwtService.generateToken(user.getEmail(), "auth");

        return new LoginResponse(
                true,
                "Login Successful",
                authToken,
                user.getRole().name()
        );
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
        member.setQrToken(UUID.randomUUID().toString());

        member.setUser(user);

        memberRepository.save(member);

        return new RegisterResponse(
                true,
                "Registration Successful"
        );
    }
    public RegisterResponse completeRegistration(
            CompleteRegistrationRequest request) {

        /*
         * STEP 1:
         * Check whether the email already exists
         */

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            return new RegisterResponse(
                    false,
                    "Email already exists"
            );
        }


        /*
         * STEP 2:
         * Find the latest OTP for this email
         */

        OtpVerification verification =
                otpRepository
                        .findTopByEmailOrderByIdDesc(
                                request.getEmail()
                        )
                        .orElse(null);


        /*
         * STEP 3:
         * OTP must exist
         */

        if (verification == null) {

            return new RegisterResponse(
                    false,
                    "OTP verification required"
            );
        }


        /*
         * STEP 4:
         * OTP must actually be verified
         */

        if (!verification.isVerified()) {

            return new RegisterResponse(
                    false,
                    "Please verify your OTP first"
            );
        }


        /*
         * STEP 5:
         * Create User
         */

        User user = new User();

        user.setEmail(request.getEmail());

        user.setUsername(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(Role.MEMBER);

        user.setEnabled(true);


        /*
         * STEP 6:
         * Create Member
         */

        Member member = new Member();

        member.setName(request.getName());

        member.setPhone(request.getPhone());

        member.setAge(18);

        member.setMembership("Basic");

        member.setQrToken(UUID.randomUUID().toString());

        member.setUser(user);


        /*
         * STEP 7:
         * Save member
         */

        memberRepository.save(member);


        /*
         * STEP 8:
         * Delete OTP after successful registration
         */

        otpRepository.deleteById(
                verification.getId()
        );


        /*
         * STEP 9:
         * Registration successful
         */

        return new RegisterResponse(
                true,
                "Registration Successful"
        );
    }
}