package com.controller;

import com.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<com.model.Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.model.Service> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    @PostMapping
    public ResponseEntity<com.model.Service> saveService(@RequestBody com.model.Service service) {
        System.out.println("Incoming Service Object: " + service);
        return ResponseEntity.ok(serviceService.saveService(service));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteServiceById(@PathVariable Long id) {
        serviceService.deleteServiceById(id);
        return ResponseEntity.ok("Service deleted successfully.");
    }

    // New endpoint to get cost by serviceName
    @GetMapping("/cost/{serviceName}")
    public ResponseEntity<Double> getServiceCost(@PathVariable String serviceName) {
        com.model.Service service = serviceService.getServiceByName(serviceName);
        if (service != null) {
            return ResponseEntity.ok(service.getCost());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

    }
}
