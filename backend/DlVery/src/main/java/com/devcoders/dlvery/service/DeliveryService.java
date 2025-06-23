package com.devcoders.dlvery.service;

import com.devcoders.dlvery.exception.ResourceNotFoundException;
import com.devcoders.dlvery.model.*;
import com.devcoders.dlvery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final InventoryTransactionService inventoryTransactionService;
    private final ProductService productService;

    public Delivery createDelivery(Delivery delivery) {
        delivery.setCreatedAt(LocalDateTime.now());
        delivery.setUpdatedAt(LocalDateTime.now());
        
        if (delivery.getStatus() == null) {
            delivery.setStatus(DeliveryStatus.PENDING);
        }
        
        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery assignDelivery(Delivery delivery) {
        // Save the delivery first
        Delivery savedDelivery = createDelivery(delivery);
        
        // Create inventory transactions for each item (STOCK_OUT)
        for (DeliveryItem item : delivery.getItems()) {
            Product product = productService.getProductBySku(item.getSku());
            
            InventoryTransaction transaction = new InventoryTransaction();
            transaction.setProductId(product.getId());
            transaction.setSku(product.getSku());
            transaction.setType(TransactionType.STOCK_OUT);
            transaction.setQuantity(item.getQuantity());
            transaction.setUserId(delivery.getDeliveryAgentId()); // The delivery agent
            transaction.setDeliveryId(savedDelivery.getId());
            transaction.setNotes("Assigned for delivery #" + savedDelivery.getId());
            transaction.setTimestamp(LocalDateTime.now());
            
            inventoryTransactionService.createTransaction(transaction);
        }
        
        return savedDelivery;
    }

    public Delivery getDeliveryById(String id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery", "id", id));
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public List<Delivery> getDeliveriesByAgentId(String agentId) {
        return deliveryRepository.findByDeliveryAgentId(agentId);
    }

    public List<Delivery> getDeliveriesByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatus(status);
    }

    public List<Delivery> getDeliveriesByAgentAndStatus(String agentId, DeliveryStatus status) {
        return deliveryRepository.findByDeliveryAgentIdAndStatus(agentId, status);
    }

    public List<Delivery> getDeliveriesByDate(LocalDate date) {
        return deliveryRepository.findByScheduledDate(date);
    }

    public List<Delivery> getDeliveriesByDateRange(LocalDate startDate, LocalDate endDate) {
        return deliveryRepository.findByScheduledDateBetween(startDate, endDate);
    }

    public List<Delivery> getDeliveriesByItemSku(String sku) {
        return deliveryRepository.findByItemSku(sku);
    }

    public List<Delivery> getDeliveriesWithDamagedItems() {
        return deliveryRepository.findByDamagedItems();
    }

    public List<Delivery> getTodayDeliveriesForAgent(String agentId) {
        return deliveryRepository.findByDeliveryAgentIdAndScheduledDate(agentId, LocalDate.now());
    }

    @Transactional
    public Delivery updateDeliveryStatus(String id, DeliveryStatus status, String notes) {
        Delivery delivery = getDeliveryById(id);
        DeliveryStatus oldStatus = delivery.getStatus();
        delivery.setStatus(status);
        delivery.setNotes(notes);
        delivery.setUpdatedAt(LocalDateTime.now());
        
        if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
        }
        
        // Handle inventory updates for returns or damaged items
        if (status == DeliveryStatus.RETURNED || status == DeliveryStatus.DAMAGED || 
            status == DeliveryStatus.PARTIALLY_DELIVERED) {
            for (DeliveryItem item : delivery.getItems()) {
                if (item.isReturned() || item.isDamaged()) {
                    Product product = productService.getProductBySku(item.getSku());
                    
                    TransactionType type = item.isDamaged() ? 
                            TransactionType.DAMAGED : TransactionType.RETURN;
                    
                    InventoryTransaction transaction = new InventoryTransaction();
                    transaction.setProductId(product.getId());
                    transaction.setSku(product.getSku());
                    transaction.setType(type);
                    transaction.setQuantity(item.getQuantity());
                    transaction.setUserId(delivery.getDeliveryAgentId());
                    transaction.setDeliveryId(delivery.getId());
                    transaction.setNotes("Returned from delivery #" + delivery.getId() + 
                            (item.isDamaged() ? " (Damaged)" : ""));
                    transaction.setTimestamp(LocalDateTime.now());
                    
                    inventoryTransactionService.createTransaction(transaction);
                    
                    // Update product damage status if needed
                    if (item.isDamaged() && !product.isDamaged()) {
                        product.setDamaged(true);
                        productService.updateProduct(product.getId(), product);
                    }
                }
            }
        }
        
        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery completeDelivery(String id, String customerName, String customerSignature) {
        Delivery delivery = getDeliveryById(id);
        delivery.setStatus(DeliveryStatus.DELIVERED);
        delivery.setCustomerName(customerName);
        delivery.setCustomerSignature(customerSignature);
        delivery.setDeliveredAt(LocalDateTime.now());
        delivery.setUpdatedAt(LocalDateTime.now());
        
        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery markDeliveryAsDoorLock(String id, String notes) {
        return updateDeliveryStatus(id, DeliveryStatus.DOOR_LOCK, notes);
    }

    @Transactional
    public Delivery updateDeliveryItems(String id, List<DeliveryItem> items) {
        Delivery delivery = getDeliveryById(id);
        delivery.setItems(items);
        delivery.setUpdatedAt(LocalDateTime.now());
        
        return deliveryRepository.save(delivery);
    }
}