package com.controller;

import com.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    /**
     * Get all services.
     *
     * @return List of all services.
     */
    @GetMapping
    public ResponseEntity<List<com.model.Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    /**
     * Get a specific service by ID.
     *
     * @param id Service ID.
     * @return Service object.
     */
    @GetMapping("/{id}")
    public ResponseEntity<com.model.Service> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    /**
     * Save a new service.
     *
     * @param service Service to save.
     * @return Saved service object.
     */
    @PostMapping
    public ResponseEntity<com.model.Service> saveService(@RequestBody com.model.Service service) {
        System.out.println("Incoming Service Object: " + service);
        return ResponseEntity.ok(serviceService.saveService(service));
    }

    /**
     * Delete a service by ID.
     *
     * @param id Service ID to delete.
     * @return Success message.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteServiceById(@PathVariable Long id) {
        serviceService.deleteServiceById(id);
        return ResponseEntity.ok("Service deleted successfully.");
    }
}
