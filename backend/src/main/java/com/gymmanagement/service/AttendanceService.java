package com.gymmanagement.service;

import com.gymmanagement.entity.Attendance;
import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.User;
import com.gymmanagement.repository.AttendanceRepository;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberRepository memberRepository;

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Member member = memberRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Member profile not found"));

        return attendanceRepository
                .findByMemberIdOrderByAttendanceDateDesc(member.getId());
    }

    public Attendance saveAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendance(Long id, Attendance attendance) {
        attendance.setId(id);
        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}