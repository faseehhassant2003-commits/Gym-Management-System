package com.gymmanagement.controller;

import com.gymmanagement.service.SendGridService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class MailTestController {

    private final SendGridService sendGridService;

    public MailTestController(SendGridService sendGridService) {
        this.sendGridService = sendGridService;
    }

    @GetMapping("/mail-test")
    public String sendMail() {

        try {

            sendGridService.sendEmail(
                    "faseehoff@gmail.com",
                    "Gym Management Test",
                    "Congratulations! SendGrid is working."
            );

            return "Email Sent Successfully";

        } catch (IOException e) {

            e.printStackTrace();

            return "Email Failed: " + e.getMessage();
        }
    }
}