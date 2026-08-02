package com.gymmanagement.controller;

import com.gymmanagement.entity.Member;
import com.gymmanagement.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
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
@CrossOrigin(origins = {"http://localhost:5174","http://localhost:5173"})
public class MemberController {
    @Autowired
    private MemberService memberService;
    @GetMapping("/members")
    public List<Member> getAllMembers(){
        return memberService.getAllMembers();

    }
    @PostMapping("/members")
    public Member saveMember(@RequestBody Member member){
        return memberService.saveMember(member);
    }
    @PutMapping("/members/{id}")
    public Member updateMember(@PathVariable Long id,
                               @RequestBody Member member) {

        return memberService.updateMember(id, member);
    }
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
}
