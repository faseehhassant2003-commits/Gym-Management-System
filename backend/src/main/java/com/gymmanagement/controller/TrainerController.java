package com.gymmanagement.controller;
import com.gymmanagement.dto.TrainerRequest;
import com.gymmanagement.entity.Trainer;
import com.gymmanagement.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TrainerController {
    @Autowired
    private TrainerService trainerService;

    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @GetMapping("/trainers")
    public List<Trainer> getAllTrainers(){
        return trainerService.getAllTrainers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/trainers")
    public Trainer saveTrainer(@RequestBody TrainerRequest request){

        return trainerService.saveTrainer(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/trainers/{id}")
    public Trainer updateTrainer(
            @PathVariable Long id,
            @RequestBody Trainer trainer){
        return trainerService.updateTrainer(id,trainer);

    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/trainers/{id}")
    public void deleteTrainer(@PathVariable Long id){
        trainerService.deleteTrainer(id);
    }
}
