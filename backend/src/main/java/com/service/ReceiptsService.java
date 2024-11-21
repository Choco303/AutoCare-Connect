package com.service;

import com.model.Receipts;
import com.repository.ReceiptsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReceiptsService {

    @Autowired
    private ReceiptsRepository receiptsRepository;

    public List<Receipts> getAllReceipts() {
        List<Receipts> receipts = receiptsRepository.findAllByOrderByServiceDateDesc();
        System.out.println("Receipts fetched from database: " + receipts);
        return receipts;
    }

    public List<Receipts> getReceiptsByMechanic(String mechanicUsername) {
        return receiptsRepository.findByMechanicUsername(mechanicUsername);
    }

    public List<Receipts> getLatestReceipts() {
        return receiptsRepository.findTop6ByOrderByServiceDateDesc();
    }

    public List<Receipts> searchByCarDetails(String carDetails) {
        return receiptsRepository.findByCarDetailsContainingIgnoreCase(carDetails);
    }

    public List<Receipts> searchByTask(String task) {
        return receiptsRepository.findByTaskContainingIgnoreCase(task);
    }

    public Receipts saveReceipt(Receipts receipt) {
        return receiptsRepository.save(receipt);
    }

    public void deleteReceiptById(Long id) {
        receiptsRepository.deleteById(id);
    }

}

