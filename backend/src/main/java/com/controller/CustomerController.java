package com.controller;

import com.model.Customer;
import com.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Customer loginDetails) {
        Optional<Customer> customer = customerRepository.findByUsernameAndPassword(
                loginDetails.getUsername(),
                loginDetails.getPassword()
        );
        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get()); // Return complete customer on successful login
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody Customer newCustomer) {
        Optional<Customer> existingCustomer = customerRepository.findByUsername(newCustomer.getUsername());
        if (existingCustomer.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }
        customerRepository.save(newCustomer);
        return ResponseEntity.ok("Customer registered successfully");
    }

    @GetMapping("/details/{username}")
    public ResponseEntity<?> getCustomerDetails(@PathVariable String username) {
        Optional<Customer> customer = customerRepository.findByUsername(username);
        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
    }

    @PutMapping("/update-email")
    public ResponseEntity<?> updateEmail(@RequestParam String username, @RequestParam String newEmail) {
        Optional<Customer> customer = customerRepository.findByUsername(username);
        if (customer.isPresent()) {
            Customer existingCustomer = customer.get();
            existingCustomer.setEmail(newEmail);
            customerRepository.save(existingCustomer);
            return ResponseEntity.ok("Email updated successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestParam String username, @RequestParam String newPassword) {
        Optional<Customer> customer = customerRepository.findByUsername(username);
        if (customer.isPresent()) {
            Customer existingCustomer = customer.get();
            existingCustomer.setPassword(newPassword);
            customerRepository.save(existingCustomer);
            return ResponseEntity.ok("Password updated successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
    }

    @PutMapping("/update-number")
    public ResponseEntity<?> updatePhoneNumber(@RequestParam String username, @RequestParam String newNumber) {
        Optional<Customer> customer = customerRepository.findByUsername(username);
        if (customer.isPresent()) {
            Customer existingCustomer = customer.get();
            existingCustomer.setPhone(newNumber);
            customerRepository.save(existingCustomer);
            return ResponseEntity.ok("Phone number updated successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return ResponseEntity.ok(customers);
    }
}
