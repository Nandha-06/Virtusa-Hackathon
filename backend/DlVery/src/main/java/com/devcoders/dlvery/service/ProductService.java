package com.devcoders.dlvery.service;

import com.devcoders.dlvery.model.Product;
import com.devcoders.dlvery.model.ProductCategory;
import com.devcoders.dlvery.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product createProduct(Product product) {
        if (productRepository.existsBySku(product.getSku())) {
            throw new RuntimeException("Product with SKU " + product.getSku() + " already exists");
        }
        
        product.setCreatedAt(LocalDate.now());
        product.setUpdatedAt(LocalDate.now());
        
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product productDetails) {
        Product product = getProductById(id);
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setCategory(productDetails.getCategory());
        product.setDamaged(productDetails.isDamaged());
        product.setPerishable(productDetails.isPerishable());
        product.setExpiryDate(productDetails.getExpiryDate());
        product.setQuantity(productDetails.getQuantity());
        product.setUpdatedAt(LocalDate.now());
        
        return productRepository.save(product);
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getDamagedProducts() {
        return productRepository.findByDamaged(true);
    }

    public List<Product> getPerishableProducts() {
        return productRepository.findByPerishable(true);
    }

    public List<Product> getProductsExpiringBefore(LocalDate date) {
        return productRepository.findByExpiryDateBefore(date);
    }

    public List<Product> getProductsExpiringBetween(LocalDate startDate, LocalDate endDate) {
        return productRepository.findByExpiryDateBetween(startDate, endDate);
    }

    public void deleteProduct(String id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public Product updateProductQuantity(String id, int quantityChange) {
        Product product = getProductById(id);
        int newQuantity = product.getQuantity() + quantityChange;
        
        if (newQuantity < 0) {
            throw new RuntimeException("Cannot reduce quantity below zero");
        }
        
        product.setQuantity(newQuantity);
        product.setUpdatedAt(LocalDate.now());
        
        return productRepository.save(product);
    }
}