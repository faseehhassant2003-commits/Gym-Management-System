package com.gymmanagement.controller;

import com.gymmanagement.dto.MemberProfileResponse;
import com.gymmanagement.dto.MemberRequest;
import com.gymmanagement.entity.Member;
import com.gymmanagement.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController

public class MemberController {
    @Autowired
    private MemberService memberService;

    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @GetMapping("/members")
    public List<Member> getAllMembers(){
        return memberService.getAllMembers();

    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/members")
    public Member saveMember(@RequestBody MemberRequest request) {
        return memberService.saveMember(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/members/{id}")
    public Member updateMember(@PathVariable Long id,
                               @RequestBody Member member) {

        return memberService.updateMember(id, member);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/members/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {

        try {

            memberService.deleteMember(id);

            return ResponseEntity.ok("Member deleted successfully.");

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        }

    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/members/profile")
    public MemberProfileResponse getMyProfile() {
        return memberService.getCurrentMemberProfile();
    }

    @PreAuthorize("hasRole('MEMBER')")
    @PutMapping("/members/profile")
    public MemberProfileResponse updateMyProfile(@RequestBody MemberRequest request) {
        return memberService.updateCurrentMemberProfile(request);
    }
}
