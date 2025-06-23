package com.devcoders.dlvery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryItem {
    private String productId;  // Reference to Product
    private String sku;  // Duplicate from Product for quick reference
    private String productName;  // Duplicate from Product for quick reference
    private int quantity;
    private boolean damaged;  // Whether item was damaged during delivery
    private boolean returned;  // Whether item was returned to warehouse
}