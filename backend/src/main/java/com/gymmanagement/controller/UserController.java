package com.gymmanagement.controller;

import com.gymmanagement.dto.UserResponse;
import com.gymmanagement.entity.User;
import com.gymmanagement.enums.Role;
import com.gymmanagement.service.UserManagementService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserManagementService userManagementService;

    public UserController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    // Get all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userManagementService.getAllUsers();
    }

    // Update user role
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public User updateRole(
            @PathVariable Long id,
            @RequestParam Role role) {

        return userManagementService.updateRole(id, role);
    }

    // Enable / Disable user
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public User updateStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled) {

        return userManagementService.updateStatus(id, enabled);
    }

    // Delete user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userManagementService.deleteUser(id);
    }

}