package com.controller;

import com.model.Admin;
import com.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;
    // Admin login
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Admin loginDetails) {
        Admin admin = adminRepository.findByUsernameAndPassword(
                loginDetails.getUsername(),
                loginDetails.getPassword()
        );
        if (admin != null) {
            return ResponseEntity.ok(admin.getUsername()); // Return username on successful login
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    // Register a new admin
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin newAdmin) {
        try {
            adminRepository.save(newAdmin);
            return ResponseEntity.ok("Admin registered");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register admin: " + e.getMessage());
        }
    }

    // Get all admins
    @GetMapping("/all")
    public ResponseEntity<?> getAllAdmins() {
        return ResponseEntity.ok(adminRepository.findAll());
    }

}
