package com.gymmanagement.service;
import com.gymmanagement.dto.TrainerRequest;
import com.gymmanagement.entity.Trainer;
import com.gymmanagement.entity.User;
import com.gymmanagement.enums.Role;
import com.gymmanagement.repository.TrainerRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Trainer> getAllTrainers(){
        return trainerRepository.findAll();

            }
    public Trainer saveTrainer(TrainerRequest request) {

        Trainer trainer = new Trainer();

        trainer.setName(request.getName());
        trainer.setAge(request.getAge());
        trainer.setPhone(request.getPhone());
        trainer.setSpecialization(request.getSpecialization());
        trainer.setSalary(request.getSalary());

        if (request.isCreateLogin()) {

            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new RuntimeException("Username already exists.");
            }

            User user = new User();

            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(Role.TRAINER);
            user.setEnabled(true);

            trainer.setUser(user);
        }

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
