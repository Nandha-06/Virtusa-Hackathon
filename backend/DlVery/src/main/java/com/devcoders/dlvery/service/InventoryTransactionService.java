package com.devcoders.dlvery.service;

import com.devcoders.dlvery.model.InventoryTransaction;
import com.devcoders.dlvery.model.Product;
import com.devcoders.dlvery.model.TransactionType;
import com.devcoders.dlvery.repository.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;
    private final ProductService productService;

    @Transactional
    public InventoryTransaction createTransaction(InventoryTransaction transaction) {
        // Set timestamp if not already set
        if (transaction.getTimestamp() == null) {
            transaction.setTimestamp(LocalDateTime.now());
        }
        
        // Update product quantity based on transaction type
        Product product = productService.getProductById(transaction.getProductId());
        int quantityChange = 0;
        
        switch (transaction.getType()) {
            case STOCK_IN:
                quantityChange = transaction.getQuantity();
                break;
            case STOCK_OUT:
                quantityChange = -transaction.getQuantity();
                break;
            case RETURN:
                quantityChange = transaction.getQuantity();
                break;
            case ADJUSTMENT:
                // For adjustment, the quantity field directly represents the change
                quantityChange = transaction.getQuantity();
                break;
            case DAMAGED:
                // Mark product as damaged and reduce quantity
                product.setDamaged(true);
                quantityChange = -transaction.getQuantity();
                break;
            case EXPIRED:
                // Reduce quantity for expired products
                quantityChange = -transaction.getQuantity();
                break;
        }
        
        // Update product quantity
        productService.updateProductQuantity(product.getId(), quantityChange);
        
        // Save transaction
        return transactionRepository.save(transaction);
    }

    public InventoryTransaction getTransactionById(String id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<InventoryTransaction> getTransactionsByProductId(String productId) {
        return transactionRepository.findByProductId(productId);
    }

    public List<InventoryTransaction> getTransactionsBySku(String sku) {
        return transactionRepository.findBySku(sku);
    }

    public List<InventoryTransaction> getTransactionsByType(TransactionType type) {
        return transactionRepository.findByType(type);
    }

    public List<InventoryTransaction> getTransactionsByUserId(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    public List<InventoryTransaction> getTransactionsByDeliveryId(String deliveryId) {
        return transactionRepository.findByDeliveryId(deliveryId);
    }

    public List<InventoryTransaction> getTransactionsByDateRange(LocalDateTime startTime, LocalDateTime endTime) {
        return transactionRepository.findByTimestampBetween(startTime, endTime);
    }

    public List<InventoryTransaction> getTransactionsByProductAndDateRange(String productId, LocalDateTime startTime, LocalDateTime endTime) {
        return transactionRepository.findByProductIdAndTimestampBetween(productId, startTime, endTime);
    }
}