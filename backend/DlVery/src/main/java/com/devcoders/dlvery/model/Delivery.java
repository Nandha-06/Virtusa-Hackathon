package com.devcoders.dlvery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "deliveries")
public class Delivery {
    
    @Id
    private String id;
    private String deliveryAgentId;  // Reference to User with DLTEAM role
    private List<DeliveryItem> items;
    private String customerName;
    private String customerAddress;
    private String customerPhone;
    private DeliveryStatus status;
    private DeliveryPriority priority;
    private LocalDate scheduledDate;
    private LocalDateTime deliveredAt;
    private String customerSignature;  // Base64 encoded image
    private String notes;  // For door lock, damage, or other notes
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}