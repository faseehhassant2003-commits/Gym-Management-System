package com.gymmanagement.service;

import com.gymmanagement.entity.OtpVerification;
import com.gymmanagement.repository.OtpRepository;
import com.gymmanagement.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final SendGridService sendGridService;

    public OtpService(
            OtpRepository otpRepository,
            UserRepository userRepository,
            SendGridService sendGridService) {

        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.sendGridService = sendGridService;
    }


    public void sendOtp(String email) throws IOException {

        /*
         * STEP 1:
         * Check whether email already exists
         */

        if (userRepository.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }


        /*
         * STEP 2:
         * Delete any previous OTP for this email
         */

        otpRepository.deleteByEmail(email);


        /*
         * STEP 3:
         * Generate a new 6-digit OTP
         */

        String otp = String.format(
                "%06d",
                new Random().nextInt(1000000)
        );


        /*
         * STEP 4:
         * Create OTP verification record
         */

        OtpVerification verification =
                new OtpVerification();

        verification.setEmail(email);

        verification.setOtp(otp);

        verification.setVerified(false);

        verification.setExpiresAt(
                LocalDateTime.now().plusMinutes(5)
        );


        /*
         * STEP 5:
         * Save OTP
         */

        otpRepository.save(verification);


        /*
         * STEP 6:
         * Send OTP email
         */

        sendGridService.sendEmail(
                email,
                "Gym Management OTP",
                "Your OTP is: " + otp
                        + "\n\nThis OTP expires in 5 minutes."
        );
    }


    public boolean verifyOtp(
            String email,
            String otp) {

        /*
         * Find the latest OTP
         */

        OtpVerification verification =
                otpRepository
                        .findTopByEmailOrderByIdDesc(email)
                        .orElse(null);


        /*
         * OTP does not exist
         */

        if (verification == null) {
            return false;
        }


        /*
         * Already verified
         */

        if (verification.isVerified()) {
            return false;
        }


        /*
         * OTP expired
         */

        if (verification.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            return false;
        }


        /*
         * OTP does not match
         */

        if (!verification.getOtp().equals(otp)) {
            return false;
        }


        /*
         * OTP is correct
         */

        verification.setVerified(true);

        otpRepository.save(verification);

        return true;
    }
}