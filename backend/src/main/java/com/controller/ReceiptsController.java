package com.controller;

import com.model.Receipts;
import com.service.ReceiptsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptsController {

    @Autowired
    private ReceiptsService receiptsService;

    // Endpoint to fetch all receipts, sorted by service date (descending)
    @GetMapping
    public List<Receipts> getAllReceipts() {
        return receiptsService.getAllReceipts();
    }

    // Endpoint to fetch the latest 6 receipts
    @GetMapping("/latest")
    public List<Receipts> getLatestReceipts() {
        return receiptsService.getLatestReceipts();
    }

    // Endpoint to search receipts by car details
    @GetMapping("/searchByCar")
    public List<Receipts> searchByCarDetails(@RequestParam("carDetails") String carDetails) {
        return receiptsService.searchByCarDetails(carDetails);
    }

    // Endpoint to search receipts by task
    @GetMapping("/searchByTask")
    public List<Receipts> searchByTask(@RequestParam("task") String task) {
        return receiptsService.searchByTask(task);
    }

    // Endpoint to add a new receipt
    @PostMapping
    public Receipts addReceipt(@RequestBody Receipts receipt) {
        return receiptsService.saveReceipt(receipt);
    }

    // Endpoint to delete a receipt by ID
    @DeleteMapping("/{id}")
    public void deleteReceipt(@PathVariable Long id) {
        receiptsService.deleteReceiptById(id);
    }

    @GetMapping("/byMechanic")
    public List<Receipts> getReceiptsByMechanic(@RequestParam("username") String mechanicUsername) {
        return receiptsService.getReceiptsByMechanic(mechanicUsername);
    }

}
