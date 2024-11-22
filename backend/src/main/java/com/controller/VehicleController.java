package com.controller;

import com.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping("/makes")
    public ResponseEntity<String> getMakes() {
        String makes = vehicleService.getMakes();
        return ResponseEntity.ok(makes);
    }

    @GetMapping("/models")
    public ResponseEntity<String> getModels(@RequestParam String make) {
        String models = vehicleService.getModels(make);
        return ResponseEntity.ok(models);
    }

    @GetMapping("/years")
    public ResponseEntity<String> getYears() {
        String years = vehicleService.getYears();
        return ResponseEntity.ok(years);
    }
}
