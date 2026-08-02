package com.gymmanagement.service;

import com.gymmanagement.entity.Trainer;
import com.gymmanagement.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    public List<Trainer> getAllTrainers(){
        return trainerRepository.findAll();

            }
 public Trainer saveTrainer(Trainer trainer){
        return trainerRepository.save(trainer);
 }
 public Trainer updateTrainer(Long id,Trainer trainer){
        trainer.setId(id);
        return trainerRepository.save(trainer);
 }
 public void deleteTrainer(Long id){
        trainerRepository.deleteById(id);
 }

}
