package com.controller;

// CustomerController.java
import com.model.Customer;
import com.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access the backend
public class CustomerController {
    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/login")
    public Customer saveCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }
}
