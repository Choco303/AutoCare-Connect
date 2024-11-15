package com.controller;

import com.model.Customer;
import com.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/login")
    public String login(@RequestBody Customer loginDetails) {
        Customer customer = customerRepository.findByUsernameAndPassword(loginDetails.getUsername(), loginDetails.getPassword());
        if (customer != null) {
            return "Login successful!";
        } else {
            return "Login failed.";
        }
    }

    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}
