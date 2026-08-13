package com.gymmanagement.repository;

import com.gymmanagement.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    void deleteByMemberId(Long memberId);

}