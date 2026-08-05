package com.gymmanagement.service;

import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.Payment;
import org.springframework.data.domain.PageRequest;

import com.gymmanagement.dto.DashboardSummary;
import com.gymmanagement.repository.AttendanceRepository;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.repository.PaymentRepository;
import com.gymmanagement.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gymmanagement.dto.MemberStats;

import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;
    public List<Member> getRecentMembers() {
        return memberRepository.findAllByOrderByIdDesc(PageRequest.of(0, 5));
    }
    public List<Payment> getRecentPayments() {
        return paymentRepository.findAllByOrderByIdDesc(PageRequest.of(0, 5));
    }
    public DashboardSummary getDashboardSummary() {

        long totalMembers = memberRepository.count();

        long totalTrainers = trainerRepository.count();

        long totalAttendance = attendanceRepository.count();

        double totalRevenue = paymentRepository.getTotalRevenue();

        return new DashboardSummary(
                totalMembers,
                totalTrainers,
                totalRevenue,
                totalAttendance
        );
    }
    public List<MemberStats> getMemberStats(){
        return memberRepository.getMemberStats();
    }


}