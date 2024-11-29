package com.service;

import com.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public List<com.model.Service> getAllServices() {
        return serviceRepository.findAll();
    }

    // get the service by its id
    public com.model.Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with ID: " + id));
    }

    // save the service
    public com.model.Service saveService(com.model.Service service) {
        System.out.println("Saving Service: " + service);
        return serviceRepository.save(service);
    }

    // delete the service by id
    public void deleteServiceById(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new IllegalArgumentException("Service not found with ID: " + id);
        }
        serviceRepository.deleteById(id);
    }
}
