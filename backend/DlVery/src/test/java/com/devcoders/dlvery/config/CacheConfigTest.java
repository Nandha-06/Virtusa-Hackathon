package com.devcoders.dlvery.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class CacheConfigTest {

    @Autowired
    private CacheManager cacheManager;

    @Test
    @DisplayName("Test cache manager initialization")
    void testCacheManagerInitialization() {
        // Then
        assertThat(cacheManager).isNotNull();
    }

    @Test
    @DisplayName("Test users cache exists")
    void testUsersCacheExists() {
        // When
        Cache usersCache = cacheManager.getCache("users");
        
        // Then
        assertThat(usersCache).isNotNull();
    }

    @Test
    @DisplayName("Test products cache exists")
    void testProductsCacheExists() {
        // When
        Cache productsCache = cacheManager.getCache("products");
        
        // Then
        assertThat(productsCache).isNotNull();
    }

    @Test
    @DisplayName("Test deliveries cache exists")
    void testDeliveriesCacheExists() {
        // When
        Cache deliveriesCache = cacheManager.getCache("deliveries");
        
        // Then
        assertThat(deliveriesCache).isNotNull();
    }

    @Test
    @DisplayName("Test inventoryTransactions cache exists")
    void testInventoryTransactionsCacheExists() {
        // When
        Cache inventoryTransactionsCache = cacheManager.getCache("inventoryTransactions");
        
        // Then
        assertThat(inventoryTransactionsCache).isNotNull();
    }

    @Test
    @DisplayName("Test cache operations")
    void testCacheOperations() {
        // Given
        String key = "testKey";
        String value = "testValue";
        Cache usersCache = cacheManager.getCache("users");
        
        // When
        usersCache.put(key, value);
        
        // Then
        assertThat(usersCache.get(key).get()).isEqualTo(value);
        
        // When
        usersCache.evict(key);
        
        // Then
        assertThat(usersCache.get(key)).isNull();
    }
}