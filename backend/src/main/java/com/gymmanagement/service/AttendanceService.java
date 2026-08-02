package com.gymmanagement.service;

import com.gymmanagement.entity.Attendance;
import com.gymmanagement.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<Attendance> getAllAttendance(){
        return attendanceRepository.findAll();
    }
    public Attendance saveAttendance(Attendance attendance){
        return attendanceRepository.save(attendance);

    }
    public Attendance updateAttendance(Long id,Attendance attendance){
        attendance.setId(id);
        return attendanceRepository.save(attendance);

    }
    public void deleteAttendance(Long id){
        attendanceRepository.deleteById(id);
    }
}
