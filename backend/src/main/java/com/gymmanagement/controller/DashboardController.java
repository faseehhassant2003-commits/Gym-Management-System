package com.gymmanagement.controller;
import com.gymmanagement.dto.DashboardSummary;
import com.gymmanagement.entity.Member;
import com.gymmanagement.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.gymmanagement.dto.MemberStats;

@RestController

public class DashboardController {
    @GetMapping("/dashboard/recent-members")
    public List<Member> getRecentMembers() {
        return dashboardService.getRecentMembers();
    }



    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboard/summary")
    public DashboardSummary getDashboardSummary() {
        return dashboardService.getDashboardSummary();
    }

    @GetMapping("/dashboard/member-stats")
    public List<MemberStats> getMemberStats() {

        return dashboardService.getMemberStats();

    }
}