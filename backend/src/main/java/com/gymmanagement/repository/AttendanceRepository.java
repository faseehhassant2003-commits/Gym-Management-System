package com.gymmanagement.repository;

import com.gymmanagement.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    void deleteByMemberId(Long memberId);
    List<Attendance> findByMemberIdOrderByAttendanceDateDesc(Long memberId);
}