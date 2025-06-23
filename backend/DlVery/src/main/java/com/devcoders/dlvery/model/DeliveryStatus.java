package com.devcoders.dlvery.model;

public enum DeliveryStatus {
    PENDING,       // Assigned but not yet started
    IN_TRANSIT,    // Delivery in progress
    DELIVERED,     // Successfully delivered
    DOOR_LOCK,     // Customer not available
    RETURNED,      // Returned to warehouse
    PARTIALLY_DELIVERED,  // Some items delivered, some returned
    DAMAGED        // Items damaged during delivery
}