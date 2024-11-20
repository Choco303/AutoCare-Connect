package com.controller;

import com.model.Mechanic ;
import com.repository.MechanicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mechanic")
public class MechanicController {

    @Autowired
    private MechanicRepository mechanicRepository;

    // Login endpoint for mechanic
    @PostMapping("/login")
    public ResponseEntity<?> mechanicLogin(@RequestBody Mechanic  loginDetails) {
         Mechanic mechanic = mechanicRepository.findByUsernameAndPassword(
                loginDetails.getUsername(),
                loginDetails.getPassword()
        );
        if (mechanic != null) {
            return ResponseEntity.ok(mechanic.getUsername()); // Return username on successful login
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    // Register endpoint for mechanic
    @PostMapping("/register")
    public ResponseEntity<?> registerMechanic (@RequestBody Mechanic newMechanic ) {
        try {
            mechanicRepository.save(newMechanic );
            return ResponseEntity.ok( "Mechanic registered");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register mechanic: " + e.getMessage());
        }
    }

    // Fetch all mechanics endpoint
    @GetMapping("/all")
    public ResponseEntity<?> getAllMechanics() {
        return ResponseEntity.ok(mechanicRepository.findAll());
    }
}
