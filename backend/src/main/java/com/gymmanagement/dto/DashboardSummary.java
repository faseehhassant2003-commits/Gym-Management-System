package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummary {
    public long totalMembers;
    public long totalTrainers;
    private long totalAttendance;

}
