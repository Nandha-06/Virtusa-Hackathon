package com.devcoders.dlvery.repository;

import com.devcoders.dlvery.model.InventoryTransaction;
import com.devcoders.dlvery.model.TransactionType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryTransactionRepository extends MongoRepository<InventoryTransaction, String> {
    List<InventoryTransaction> findByProductId(String productId);
    List<InventoryTransaction> findBySku(String sku);
    List<InventoryTransaction> findByType(TransactionType type);
    List<InventoryTransaction> findByUserId(String userId);
    List<InventoryTransaction> findByDeliveryId(String deliveryId);
    List<InventoryTransaction> findByTimestampBetween(LocalDateTime startTime, LocalDateTime endTime);
    List<InventoryTransaction> findByProductIdAndTimestampBetween(String productId, LocalDateTime startTime, LocalDateTime endTime);
}