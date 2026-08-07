package com.gymmanagement.dto;

import lombok.Data;

@Data
public class MemberRequest {

    private String name;
    private int age;
    private String phone;
    private String membership;

    // Login Account
    private boolean createLogin;
    private String username;
    private String password;

}