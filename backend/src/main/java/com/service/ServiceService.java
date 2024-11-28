package com.service;

import com.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    /**
     * Get all services.
     *
     * @return List of all services.
     */
    public List<com.model.Service> getAllServices() {
        return serviceRepository.findAll();
    }

    /**
     * Get a specific service by ID.
     *
     * @param id Service ID.
     * @return Service object.
     */
    public com.model.Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with ID: " + id));
    }

    /**
     * Save a new service.
     *
     * @param service Service to save.
     * @return Saved service object.
     */
    public com.model.Service saveService(com.model.Service service) {
        System.out.println("Saving Service: " + service);
        return serviceRepository.save(service);
    }

    /**
     * Delete a service by ID.
     *
     * @param id Service ID to delete.
     */
    public void deleteServiceById(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new IllegalArgumentException("Service not found with ID: " + id);
        }
        serviceRepository.deleteById(id);
    }
}
