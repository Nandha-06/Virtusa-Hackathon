package com.devcoders.dlvery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    
    @Id
    private String id;
    private String sku;  // Stock Keeping Unit - unique identifier for product
    private String name;
    private String description;
    private ProductCategory category;
    private boolean damaged;
    private boolean perishable;
    private LocalDate expiryDate;  // null if not applicable
    private int quantity;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}