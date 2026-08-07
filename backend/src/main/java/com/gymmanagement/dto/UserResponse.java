package com.gymmanagement.dto;

import com.gymmanagement.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private Role role;
    private boolean enabled;

}