package com.gymmanagement.service;

import com.gymmanagement.enums.Role;
import com.gymmanagement.entity.User;
import com.gymmanagement.dto.MemberRequest;
import com.gymmanagement.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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

            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new RuntimeException("Username already exists.");
            }

            User user = new User();

            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
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
}