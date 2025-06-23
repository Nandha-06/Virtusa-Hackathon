package com.devcoders.dlvery.repository;

import com.devcoders.dlvery.model.User;
import com.devcoders.dlvery.model.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    Page<User> findByRole(UserRole role, Pageable pageable);
    Page<User> findAll(Pageable pageable);
    Optional<User> findByEmail(String email);
}