package com.gymmanagement.dto;
import lombok.Data;

@Data
public class TrainerRequest {
    private String name;
    private int age;
    private String phone;
    private String specialization;
    private Double salary;

    private boolean createLogin;
    private String email;
    private String password;
}
