package com.gymmanagement.service;

import com.gymmanagement.enums.Role;
import com.gymmanagement.entity.User;
import com.gymmanagement.dto.MemberRequest;
import com.gymmanagement.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import com.gymmanagement.dto.MemberProfileResponse;
import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }
    public Member saveMember(MemberRequest request) {

        Member member = new Member();

        member.setName(request.getName());
        member.setAge(request.getAge());
        member.setPhone(request.getPhone());
        member.setMembership(request.getMembership());

        if (request.isCreateLogin()) {

            // Check whether email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException(
                        "Email already exists."
                );
            }

            User user = new User();

            // Email is now the login identifier
            user.setEmail(request.getEmail());

            // Keep username same as email for compatibility
            user.setUsername(request.getEmail());

            user.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );

            user.setRole(Role.MEMBER);
            user.setEnabled(true);

            member.setUser(user);
        }

        return memberRepository.save(member);
    }
    public Member updateMember(Long id, Member member) {

        member.setId(id);

        return memberRepository.save(member);
    }
    public void deleteMember(Long id) {

        try {

            memberRepository.deleteById(id);

        } catch (DataIntegrityViolationException e) {

            throw new RuntimeException(
                    "Cannot delete member because attendance records exist."
            );

        }

    }

    public MemberProfileResponse getCurrentMemberProfile() {
        Member member = getAuthenticatedMember();
        return mapToProfileResponse(member);
    }

    public MemberProfileResponse updateCurrentMemberProfile(MemberRequest request) {
        Member member = getAuthenticatedMember();

        if (request.getAge() > 0) {
            member.setAge(request.getAge());
        }
        if (request.getHeight() > 0) {
            member.setHeight(request.getHeight());
        }
        if (request.getWeight() > 0) {
            member.setWeight(request.getWeight());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            member.setPhone(request.getPhone());
        }
      
        if (request.getName() != null && !request.getName().isBlank()) {
            member.setName(request.getName());
        }

        Member savedMember = memberRepository.save(member);
        return mapToProfileResponse(savedMember);
    }

    private Member getAuthenticatedMember() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Authenticated user not found.");
        }

        String email = authentication.getName();

        return memberRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "Member profile not found for current user."
                ));
    }

    private MemberProfileResponse mapToProfileResponse(Member member) {
        return new MemberProfileResponse(
                member.getId(),
                member.getName(),
                member.getAge(),
                member.getPhone(),
                member.getMembership(),
                member.getHeight(),
                member.getWeight(),
                member.getUser() != null ? member.getUser().getEmail() : null,
                member.getUser() != null ? member.getUser().getUsername() : null
        );
    }
}