package com.devcoders.dlvery.controller;

import com.devcoders.dlvery.dto.ApiResponse;
import com.devcoders.dlvery.model.Delivery;
import com.devcoders.dlvery.model.DeliveryItem;
import com.devcoders.dlvery.model.DeliveryStatus;
import com.devcoders.dlvery.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    // Inventory Team Endpoints
    @PostMapping("/api/invteam/deliveries")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<Delivery>> createDelivery(@Valid @RequestBody Delivery delivery) {
        Delivery createdDelivery = deliveryService.assignDelivery(delivery);
        return ResponseEntity.ok(ApiResponse.success("Delivery created and assigned successfully", createdDelivery));
    }

    @GetMapping("/api/invteam/deliveries")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getAllDeliveries() {
        List<Delivery> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/api/invteam/deliveries/{id}")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<Delivery>> getDeliveryById(@PathVariable String id) {
        Delivery delivery = deliveryService.getDeliveryById(id);
        return ResponseEntity.ok(ApiResponse.success(delivery));
    }

    @GetMapping("/api/invteam/deliveries/agent/{agentId}")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getDeliveriesByAgentId(@PathVariable String agentId) {
        List<Delivery> deliveries = deliveryService.getDeliveriesByAgentId(agentId);
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/api/invteam/deliveries/status/{status}")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getDeliveriesByStatus(@PathVariable DeliveryStatus status) {
        List<Delivery> deliveries = deliveryService.getDeliveriesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/api/invteam/deliveries/date/{date}")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getDeliveriesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Delivery> deliveries = deliveryService.getDeliveriesByDate(date);
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/api/invteam/deliveries/date-range")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getDeliveriesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Delivery> deliveries = deliveryService.getDeliveriesByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/api/invteam/deliveries/sku/{sku}")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getDeliveriesByItemSku(@PathVariable String sku) {
        List<Delivery> deliveries = deliveryService.getDeliveriesByItemSku(sku);
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/api/invteam/deliveries/damaged")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getDeliveriesWithDamagedItems() {
        List<Delivery> deliveries = deliveryService.getDeliveriesWithDamagedItems();
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    // Delivery Team Endpoints
    @GetMapping("/api/dlteam/deliveries/my")
    @PreAuthorize("hasRole('DLTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getMyDeliveries() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String agentId = auth.getName(); // Assuming username is the user ID
        List<Delivery> deliveries = deliveryService.getDeliveriesByAgentId(agentId);
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/api/dlteam/deliveries/my/today")
    @PreAuthorize("hasRole('DLTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getMyTodayDeliveries() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String agentId = auth.getName(); // Assuming username is the user ID
        List<Delivery> deliveries = deliveryService.getTodayDeliveriesForAgent(agentId);
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/api/dlteam/deliveries/my/pending")
    @PreAuthorize("hasRole('DLTEAM')")
    public ResponseEntity<ApiResponse<List<Delivery>>> getMyPendingDeliveries() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String agentId = auth.getName(); // Assuming username is the user ID
        List<Delivery> deliveries = deliveryService.getDeliveriesByAgentAndStatus(agentId, DeliveryStatus.PENDING);
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/api/dlteam/deliveries/{id}")
    @PreAuthorize("hasRole('DLTEAM')")
    public ResponseEntity<ApiResponse<Delivery>> getDeliveryForAgent(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String agentId = auth.getName(); // Assuming username is the user ID
        
        Delivery delivery = deliveryService.getDeliveryById(id);
        
        // Ensure the delivery belongs to the authenticated agent
        if (!delivery.getDeliveryAgentId().equals(agentId)) {
            return ResponseEntity.ok(ApiResponse.error("You are not authorized to view this delivery"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(delivery));
    }

    @PutMapping("/api/dlteam/deliveries/{id}/complete")
    @PreAuthorize("hasRole('DLTEAM')")
    public ResponseEntity<ApiResponse<Delivery>> completeDelivery(
            @PathVariable String id,
            @RequestParam String customerName,
            @RequestParam String customerSignature) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String agentId = auth.getName(); // Assuming username is the user ID
        
        Delivery delivery = deliveryService.getDeliveryById(id);
        
        // Ensure the delivery belongs to the authenticated agent
        if (!delivery.getDeliveryAgentId().equals(agentId)) {
            return ResponseEntity.ok(ApiResponse.error("You are not authorized to update this delivery"));
        }
        
        Delivery completedDelivery = deliveryService.completeDelivery(id, customerName, customerSignature);
        return ResponseEntity.ok(ApiResponse.success("Delivery completed successfully", completedDelivery));
    }

    @PutMapping("/api/dlteam/deliveries/{id}/door-lock")
    @PreAuthorize("hasRole('DLTEAM')")
    public ResponseEntity<ApiResponse<Delivery>> markDeliveryAsDoorLock(
            @PathVariable String id,
            @RequestParam String notes) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String agentId = auth.getName(); // Assuming username is the user ID
        
        Delivery delivery = deliveryService.getDeliveryById(id);
        
        // Ensure the delivery belongs to the authenticated agent
        if (!delivery.getDeliveryAgentId().equals(agentId)) {
            return ResponseEntity.ok(ApiResponse.error("You are not authorized to update this delivery"));
        }
        
        Delivery updatedDelivery = deliveryService.markDeliveryAsDoorLock(id, notes);
        return ResponseEntity.ok(ApiResponse.success("Delivery marked as door lock", updatedDelivery));
    }

    @PutMapping("/api/dlteam/deliveries/{id}/status")
    @PreAuthorize("hasRole('DLTEAM')")
    public ResponseEntity<ApiResponse<Delivery>> updateDeliveryStatus(
            @PathVariable String id,
            @RequestParam DeliveryStatus status,
            @RequestParam(required = false) String notes) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String agentId = auth.getName(); // Assuming username is the user ID
        
        Delivery delivery = deliveryService.getDeliveryById(id);
        
        // Ensure the delivery belongs to the authenticated agent
        if (!delivery.getDeliveryAgentId().equals(agentId)) {
            return ResponseEntity.ok(ApiResponse.error("You are not authorized to update this delivery"));
        }
        
        Delivery updatedDelivery = deliveryService.updateDeliveryStatus(id, status, notes);
        return ResponseEntity.ok(ApiResponse.success("Delivery status updated successfully", updatedDelivery));
    }

    @PutMapping("/api/dlteam/deliveries/{id}/items")
    @PreAuthorize("hasRole('DLTEAM')")
    public ResponseEntity<ApiResponse<Delivery>> updateDeliveryItems(
            @PathVariable String id,
            @Valid @RequestBody List<DeliveryItem> items) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String agentId = auth.getName(); // Assuming username is the user ID
        
        Delivery delivery = deliveryService.getDeliveryById(id);
        
        // Ensure the delivery belongs to the authenticated agent
        if (!delivery.getDeliveryAgentId().equals(agentId)) {
            return ResponseEntity.ok(ApiResponse.error("You are not authorized to update this delivery"));
        }
        
        Delivery updatedDelivery = deliveryService.updateDeliveryItems(id, items);
        return ResponseEntity.ok(ApiResponse.success("Delivery items updated successfully", updatedDelivery));
    }

    @PutMapping("/api/dlteam/deliveries/{id}/start")
    @PreAuthorize("hasRole('DLTEAM')")
    public ResponseEntity<ApiResponse<Delivery>> startDelivery(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String agentId = auth.getName();

        Delivery delivery = deliveryService.getDeliveryById(id);

        // Ensure the delivery belongs to the authenticated agent
        if (!delivery.getDeliveryAgentId().equals(agentId)) {
            return ResponseEntity.ok(ApiResponse.error("You are not authorized to start this delivery"));
        }

        Delivery updatedDelivery = deliveryService.updateDeliveryStatus(id, DeliveryStatus.IN_TRANSIT, "Delivery started by agent");
        return ResponseEntity.ok(ApiResponse.success("Delivery status updated to IN_TRANSIT", updatedDelivery));
    }
}