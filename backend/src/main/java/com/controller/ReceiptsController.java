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

    // get all receipts for repair information page
    @GetMapping
    public List<Receipts> getAllReceipts() {
        return receiptsService.getAllReceipts();
    }

    // get the latest 6 receipts
    @GetMapping("/latest")
    public List<Receipts> getLatestReceipts() {
        return receiptsService.getLatestReceipts();
    }

    // get receipt by car details
    @GetMapping("/searchByCar")
    public List<Receipts> searchByCarDetails(@RequestParam("carDetails") String carDetails) {
        return receiptsService.searchByCarDetails(carDetails);
    }

    // search receipt by task
    @GetMapping("/searchByTask")
    public List<Receipts> searchByTask(@RequestParam("task") String task) {
        return receiptsService.searchByTask(task);
    }

    // get receipt by username
    @GetMapping("/byUsername")
    public List<Receipts> getReceiptsByUsername(@RequestParam("username") String username) {
        return receiptsService.getReceiptsByUsername(username);
    }

    // get receipt by mechanic
    @GetMapping("/byMechanic")
    public List<Receipts> getReceiptsByMechanic(@RequestParam("username") String mechanicUsername) {
        return receiptsService.getReceiptsByMechanic(mechanicUsername);
    }

    // add receipt
    @PostMapping
    public Receipts addReceipt(@RequestBody Receipts receipt) {
        return receiptsService.saveReceipt(receipt);
    }

    // delete receipt
    @DeleteMapping("/{id}")
    public void deleteReceipt(@PathVariable Long id) {
        receiptsService.deleteReceiptById(id);
    }
}
