package com.devcoders.dlvery.controller;

import com.devcoders.dlvery.dto.ApiResponse;
import com.devcoders.dlvery.model.Product;
import com.devcoders.dlvery.model.ProductCategory;
import com.devcoders.dlvery.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", createdProduct));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updatedProduct));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('INVTEAM', 'DLTEAM')")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/sku/{sku}")
    @PreAuthorize("hasAnyRole('INVTEAM', 'DLTEAM')")
    public ResponseEntity<ApiResponse<Product>> getProductBySku(@PathVariable String sku) {
        Product product = productService.getProductBySku(sku);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('INVTEAM', 'DLTEAM')")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('INVTEAM', 'DLTEAM')")
    public ResponseEntity<ApiResponse<List<Product>>> getProductsByCategory(
            @PathVariable ProductCategory category) {
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/damaged")
    @PreAuthorize("hasAnyRole('INVTEAM', 'DLTEAM')")
    public ResponseEntity<ApiResponse<List<Product>>> getDamagedProducts() {
        List<Product> products = productService.getDamagedProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/perishable")
    @PreAuthorize("hasAnyRole('INVTEAM', 'DLTEAM')")
    public ResponseEntity<ApiResponse<List<Product>>> getPerishableProducts() {
        List<Product> products = productService.getPerishableProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/expiring-before")
    @PreAuthorize("hasAnyRole('INVTEAM', 'DLTEAM')")
    public ResponseEntity<ApiResponse<List<Product>>> getProductsExpiringBefore(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Product> products = productService.getProductsExpiringBefore(date);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/expiring-between")
    @PreAuthorize("hasAnyRole('INVTEAM', 'DLTEAM')")
    public ResponseEntity<ApiResponse<List<Product>>> getProductsExpiringBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Product> products = productService.getProductsExpiringBetween(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @PatchMapping("/{id}/quantity")
    @PreAuthorize("hasRole('INVTEAM')")
    public ResponseEntity<ApiResponse<Product>> updateProductQuantity(
            @PathVariable String id,
            @RequestParam int quantityChange) {
        Product product = productService.updateProductQuantity(id, quantityChange);
        return ResponseEntity.ok(ApiResponse.success("Product quantity updated successfully", product));
    }
}