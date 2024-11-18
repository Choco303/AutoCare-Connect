package com.controller;

import com.model.Customer;
import com.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Customer loginDetails) {
        // Find customer by username and password
        Customer customer = customerRepository.findByUsernameAndPassword(
                loginDetails.getUsername(),
                loginDetails.getPassword()
        );
        if (customer != null) {
            return ResponseEntity.ok(customer.getUsername()); // Return username on successful login
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody Customer newCustomer) {
        try {
            // Save the customer in the database
            customerRepository.save(newCustomer);
            return ResponseEntity.ok("Customer registered successfully!");
        } catch (Exception e) {
            // Handle cases like duplicate usernames or emails
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register customer: " + e.getMessage());
        }
    }

    // Fetch all customers endpoint
    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        // Return a list of all customers
        return customerRepository.findAll();
    }
}
