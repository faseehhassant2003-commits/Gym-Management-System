package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MemberProfileResponse {

    private Long id;
    private String name;
    private int age;
    private String phone;
    private String membership;
    private double height;
    private double weight;
    private String email;
    private String username;
    private String qrToken;
}
