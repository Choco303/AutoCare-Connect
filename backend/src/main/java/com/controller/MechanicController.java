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


    @PostMapping("/login")
    public ResponseEntity<?> mechanicLogin(@RequestBody Mechanic  loginDetails) {
         Mechanic mechanic = mechanicRepository.findByUsernameAndPassword(
                loginDetails.getUsername(),
                loginDetails.getPassword()
        );
        if (mechanic != null) {
            return ResponseEntity.ok(mechanic.getUsername());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerMechanic (@RequestBody Mechanic newMechanic ) {
        try {
            mechanicRepository.save(newMechanic );
            return ResponseEntity.ok( "Mechanic registered");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register mechanic: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllMechanics() {
        return ResponseEntity.ok(mechanicRepository.findAll());
    }

}
