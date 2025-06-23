package com.devcoders.dlvery.repository;

import com.devcoders.dlvery.model.Product;
import com.devcoders.dlvery.model.ProductCategory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    Optional<Product> findBySku(String sku);
    boolean existsBySku(String sku);
    List<Product> findByCategory(ProductCategory category);
    List<Product> findByDamaged(boolean damaged);
    List<Product> findByPerishable(boolean perishable);
    List<Product> findByExpiryDateBefore(LocalDate date);
    List<Product> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);
}