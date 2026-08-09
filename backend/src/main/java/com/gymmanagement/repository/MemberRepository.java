package com.gymmanagement.repository;

import com.gymmanagement.dto.MemberStats;
import com.gymmanagement.entity.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findAllByOrderByIdDesc(Pageable pageable);

    Optional<Member> findByUserEmail(String email);

    @Query("""
        SELECT new com.gymmanagement.dto.MemberStats(
            m.membership,
            COUNT(m)
        )
        FROM Member m
        GROUP BY m.membership
    """)
    List<MemberStats> getMemberStats();
}