package com.devcoders.dlvery.model;

public enum TransactionType {
    STOCK_IN,       // New stock added to inventory
    STOCK_OUT,      // Stock removed for delivery
    RETURN,         // Stock returned from delivery
    ADJUSTMENT,     // Manual adjustment
    DAMAGED,        // Stock marked as damaged
    EXPIRED         // Stock marked as expired
}