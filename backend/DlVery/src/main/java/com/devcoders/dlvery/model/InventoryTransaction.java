package com.devcoders.dlvery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "inventory_transactions")
public class InventoryTransaction {
    
    @Id
    private String id;
    private String productId;  // Reference to Product
    private String sku;  // Duplicate from Product for quick reference
    private TransactionType type;
    private int quantity;
    private String userId;  // Reference to User who performed the transaction
    private String deliveryId;  // Reference to Delivery if applicable
    private String notes;
    private LocalDateTime timestamp;
}