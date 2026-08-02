package com.gymmanagement.repository;

import com.gymmanagement.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;



public interface TrainerRepository extends JpaRepository<Trainer,Long> {

}
