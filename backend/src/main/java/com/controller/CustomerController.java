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
            return ResponseEntity.ok("Customer registered");
        } catch (Exception e) {
            // Handle cases like duplicate usernames or emails
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register customer: " + e.getMessage());
        }
    }

    // New endpoint to fetch customer details
    @GetMapping("/details/{username}")
    public ResponseEntity<?> getCustomerDetails(@PathVariable String username) {
        Customer customer = customerRepository.findByUsername(username);
        if (customer != null) {
            return ResponseEntity.ok(customer);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
    }

    // Update email endpoint
    @PutMapping("/update-email")
    public ResponseEntity<?> updateEmail(@RequestParam String username, @RequestParam String newEmail) {
        Customer customer = customerRepository.findByUsername(username);
        if (customer != null) {
            customer.setEmail(newEmail);
            customerRepository.save(customer);
            return ResponseEntity.ok("Email updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
    }

    // Update password endpoint
    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestParam String username, @RequestParam String newPassword) {
        Customer customer = customerRepository.findByUsername(username);
        if (customer != null) {
            customer.setPassword(newPassword);
            customerRepository.save(customer);
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
    }

    // Update phone number endpoint
    @PutMapping("/update-number")
    public ResponseEntity<?> updatePhoneNumber(@RequestParam String username, @RequestParam String newNumber) {
        Customer customer = customerRepository.findByUsername(username);
        if (customer != null) {
            customer.setPhone(newNumber); // Use setPhone instead of setPhoneNumber
            customerRepository.save(customer);
            return ResponseEntity.ok("Phone number updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
    }


    // Fetch all customers endpoint
    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        // Return a list of all customers
        return customerRepository.findAll();
    }
}
