package com.controller;

import com.model.Admin;
import com.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    // Login endpoint for admin
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

    // Register endpoint for admin
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin newAdmin) {
        try {
            adminRepository.save(newAdmin);
            return ResponseEntity.ok("Admin registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register admin: " + e.getMessage());
        }
    }

    // Fetch all admins endpoint
    @GetMapping("/all")
    public ResponseEntity<?> getAllAdmins() {
        return ResponseEntity.ok(adminRepository.findAll());
    }
}
