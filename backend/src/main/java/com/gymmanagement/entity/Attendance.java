package com.gymmanagement.entity;
import  jakarta.persistence.*;
import lombok.Data;

@Data
@Entity

public class Attendance {
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
@ManyToOne
    private Member member;
private String attendanceDate;
private String status;

}
