package com.gymmanagement.dto;

import com.gymmanagement.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberCreationResponse {
    private boolean success;
    private String message;
    private String token;
    private Member member;
}
