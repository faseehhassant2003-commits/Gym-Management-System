package com.gymmanagement.controller;

import com.gymmanagement.entity.Attendance;
import com.gymmanagement.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/attendance")
    public List<Attendance> getAllAttendance(){
        return attendanceService.getAllAttendance();
    }

    @PostMapping ("/attendance")
    public Attendance saveAttendance(@RequestBody Attendance attendance){
        return attendanceService.saveAttendance(attendance);
    }

    @PutMapping("/attendance/{id}")
    public Attendance updateAttendance(@PathVariable Long id,
                                       @RequestBody Attendance attendance){
        return attendanceService.updateAttendance(id,attendance);

    }

    @DeleteMapping("/attendance/{id}")
    public void deleteAttendance(@PathVariable Long id){
        attendanceService.deleteAttendance(id);
    }
}
