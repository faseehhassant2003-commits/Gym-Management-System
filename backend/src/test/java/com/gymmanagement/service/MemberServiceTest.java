package com.gymmanagement.service;

import com.gymmanagement.dto.MemberProfileResponse;
import com.gymmanagement.dto.MemberRequest;
import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.User;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private MemberService memberService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getCurrentMemberProfileIncludesHeightAndWeight() {
        User user = new User();
        user.setEmail("member@example.com");
        user.setUsername("member");

        Member member = new Member();
        member.setId(1L);
        member.setName("Alice");
        member.setAge(29);
        member.setPhone("1234567890");
        member.setMembership("Gold");
        member.setHeight(172.5);
        member.setWeight(68.2);
        member.setUser(user);

        when(memberRepository.findByUserEmail("member@example.com")).thenReturn(Optional.of(member));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("member@example.com", null)
        );

        MemberProfileResponse profile = memberService.getCurrentMemberProfile();

        assertEquals(172.5, profile.getHeight());
        assertEquals(68.2, profile.getWeight());
    }

    @Test
    void updateCurrentMemberProfileUpdatesAgeHeightAndWeight() {
        User user = new User();
        user.setEmail("member@example.com");
        user.setUsername("member");

        Member member = new Member();
        member.setId(1L);
        member.setName("Alice");
        member.setAge(29);
        member.setPhone("1234567890");
        member.setMembership("Gold");
        member.setHeight(172.5);
        member.setWeight(68.2);
        member.setUser(user);

        MemberRequest request = new MemberRequest();
        request.setAge(31);
        request.setHeight(176.0);
        request.setWeight(72.0);

        when(memberRepository.findByUserEmail("member@example.com")).thenReturn(Optional.of(member));
        when(memberRepository.save(member)).thenReturn(member);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("member@example.com", null)
        );

        MemberProfileResponse profile = memberService.updateCurrentMemberProfile(request);

        assertEquals(31, profile.getAge());
        assertEquals(176.0, profile.getHeight());
        assertEquals(72.0, profile.getWeight());
    }
}
