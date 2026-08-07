package com.gymmanagement.controller;

import com.gymmanagement.entity.Attendance;
import com.gymmanagement.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;

    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @GetMapping("/attendance")
    public List<Attendance> getAllAttendance(){
        return attendanceService.getAllAttendance();
    }

    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @PostMapping ("/attendance")
    public Attendance saveAttendance(@RequestBody Attendance attendance){
        return attendanceService.saveAttendance(attendance);
    }

    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @PutMapping("/attendance/{id}")
    public Attendance updateAttendance(@PathVariable Long id,
                                       @RequestBody Attendance attendance){
        return attendanceService.updateAttendance(id,attendance);

    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/attendance/{id}")
    public void deleteAttendance(@PathVariable Long id){
        attendanceService.deleteAttendance(id);
    }
}
