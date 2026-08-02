package com.gymmanagement.repository;
import com.gymmanagement.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;
public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findAllByOrderByIdDesc(Pageable pageable);


}
