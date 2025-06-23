package com.devcoders.dlvery.controller;

import com.devcoders.dlvery.dto.ApiResponse;
import com.devcoders.dlvery.model.InventoryTransaction;
import com.devcoders.dlvery.model.TransactionType;
import com.devcoders.dlvery.service.InventoryTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/transactions")
@PreAuthorize("hasRole('INVTEAM')")
@RequiredArgsConstructor
public class InventoryTransactionController {

    private final InventoryTransactionService transactionService;

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryTransaction>> createTransaction(
            @Valid @RequestBody InventoryTransaction transaction) {
        InventoryTransaction createdTransaction = transactionService.createTransaction(transaction);
        return ResponseEntity.ok(ApiResponse.success("Transaction created successfully", createdTransaction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryTransaction>> getTransactionById(@PathVariable String id) {
        InventoryTransaction transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryTransaction>>> getAllTransactions() {
        List<InventoryTransaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<InventoryTransaction>>> getTransactionsByProductId(
            @PathVariable String productId) {
        List<InventoryTransaction> transactions = transactionService.getTransactionsByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ApiResponse<List<InventoryTransaction>>> getTransactionsBySku(
            @PathVariable String sku) {
        List<InventoryTransaction> transactions = transactionService.getTransactionsBySku(sku);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<InventoryTransaction>>> getTransactionsByType(
            @PathVariable TransactionType type) {
        List<InventoryTransaction> transactions = transactionService.getTransactionsByType(type);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<InventoryTransaction>>> getTransactionsByUserId(
            @PathVariable String userId) {
        List<InventoryTransaction> transactions = transactionService.getTransactionsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<ApiResponse<List<InventoryTransaction>>> getTransactionsByDeliveryId(
            @PathVariable String deliveryId) {
        List<InventoryTransaction> transactions = transactionService.getTransactionsByDeliveryId(deliveryId);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<InventoryTransaction>>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        List<InventoryTransaction> transactions = transactionService.getTransactionsByDateRange(startTime, endTime);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/product/{productId}/date-range")
    public ResponseEntity<ApiResponse<List<InventoryTransaction>>> getTransactionsByProductAndDateRange(
            @PathVariable String productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        List<InventoryTransaction> transactions = 
                transactionService.getTransactionsByProductAndDateRange(productId, startTime, endTime);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }
}