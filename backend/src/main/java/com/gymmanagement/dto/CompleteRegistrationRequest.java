package com.gymmanagement.dto;

import lombok.Data;

@Data
public class CompleteRegistrationRequest {

    private String name;

    private String email;

    private String phone;

    private String password;

    private String otp;
}