package com.gymmanagement.service;

import org.springframework.dao.DataIntegrityViolationException;
import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }
    public Member saveMember(Member member){
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