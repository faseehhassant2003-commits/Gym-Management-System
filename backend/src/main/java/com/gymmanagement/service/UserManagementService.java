package com.gymmanagement.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.gymmanagement.dto.UserResponse;
import java.util.stream.Collectors;
import com.gymmanagement.entity.User;
import com.gymmanagement.enums.Role;
import com.gymmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserManagementService {

    private final UserRepository userRepository;

    public UserManagementService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getRole(),
                        user.isEnabled()
                ))
                .collect(Collectors.toList());

    }

    // Change user role
    public User updateRole(Long id, Role role) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String loggedInUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(loggedInUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (currentUser.getId().equals(id)) {
            throw new RuntimeException("You cannot change your own role.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);

        return userRepository.save(user);
    }
    // Enable / Disable user
    public User updateStatus(Long id, boolean enabled) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String loggedInUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(loggedInUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (currentUser.getId().equals(id)) {
            throw new RuntimeException("You cannot disable your own account.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(enabled);

        return userRepository.save(user);
    }

    // Delete user
    public void deleteUser(Long id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String loggedInUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(loggedInUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (currentUser.getId().equals(id)) {
            throw new RuntimeException("You cannot delete your own account.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

}