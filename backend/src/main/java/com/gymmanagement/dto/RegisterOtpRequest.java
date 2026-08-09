package com.gymmanagement.dto;

import lombok.Data;

@Data
public class RegisterOtpRequest {

    private String name;

    private String email;

    private String phone;

    private String password;
}