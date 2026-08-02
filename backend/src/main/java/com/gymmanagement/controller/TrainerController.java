package com.gymmanagement.controller;

import com.gymmanagement.entity.Trainer;
import com.gymmanagement.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@CrossOrigin(origins = {  "http://localhost:5173", "https://gym-management-frontend-apeh.onrender.com","http://localhost:5174"
})
public class TrainerController {
    @Autowired
    private TrainerService trainerService;
    @GetMapping("/trainers")
    public List<Trainer> getAllTrainers(){
        return trainerService.getAllTrainers();
    }
    @PostMapping("/trainers")
    public Trainer saveTrainer(@RequestBody Trainer trainer){
        return trainerService.saveTrainer(trainer);
    }
    @PutMapping("/trainers/{id}")
    public Trainer updateTrainer(
            @PathVariable Long id,
            @RequestBody Trainer trainer){
        return trainerService.updateTrainer(id,trainer);

    }
    @DeleteMapping("/trainers/{id}")
    public void deleteTrainer(@PathVariable Long id){
        trainerService.deleteTrainer(id);
    }
}
