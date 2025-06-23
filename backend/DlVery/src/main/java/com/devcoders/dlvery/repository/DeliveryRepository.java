package com.devcoders.dlvery.repository;

import com.devcoders.dlvery.model.Delivery;
import com.devcoders.dlvery.model.DeliveryStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface DeliveryRepository extends MongoRepository<Delivery, String> {
    List<Delivery> findByDeliveryAgentId(String deliveryAgentId);
    List<Delivery> findByStatus(DeliveryStatus status);
    List<Delivery> findByDeliveryAgentIdAndStatus(String deliveryAgentId, DeliveryStatus status);
    List<Delivery> findByScheduledDate(LocalDate scheduledDate);
    List<Delivery> findByScheduledDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("{\"items.sku\": ?0}")
    List<Delivery> findByItemSku(String sku);
    
    @Query("{\"items.damaged\": true}")
    List<Delivery> findByDamagedItems();
    
    List<Delivery> findByDeliveryAgentIdAndScheduledDate(String deliveryAgentId, LocalDate scheduledDate);
}