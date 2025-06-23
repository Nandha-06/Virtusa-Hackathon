package com.devcoders.dlvery.service;

import com.devcoders.dlvery.dto.RegisterRequest;
import com.devcoders.dlvery.exception.ResourceNotFoundException;
import com.devcoders.dlvery.model.User;
import com.devcoders.dlvery.model.UserRole;
import com.devcoders.dlvery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @CacheEvict(value = "users", allEntries = true)
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setRole(registerRequest.getRole());
        user.setPhoneNumber(registerRequest.getPhoneNumber());

        return userRepository.save(user);
    }

    @Cacheable(value = "users", key = "'allUsers'")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Cacheable(value = "users", key = "#pageable.pageNumber + '_' + #pageable.pageSize + '_' + #pageable.sort")
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Cacheable(value = "users", key = "#id")
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Cacheable(value = "users", key = "#username")
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    @Cacheable(value = "users", key = "'role_' + #roleName")
    public List<User> getUsersByRole(String roleName) {
        try {
            UserRole role = UserRole.valueOf(roleName.toUpperCase());
            return userRepository.findByRole(role);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleName);
        }
    }
    
    @Cacheable(value = "users", key = "'role_' + #roleName + '_page_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<User> getUsersByRole(String roleName, Pageable pageable) {
        try {
            UserRole role = UserRole.valueOf(roleName.toUpperCase());
            return userRepository.findByRole(role, pageable);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleName);
        }
    }
    
    @CachePut(value = "users", key = "#user.id")
    @CacheEvict(value = "users", key = "'allUsers'")
    public User updateUser(User user) {
        // Ensure the user exists
        getUserById(user.getId());
        
        // If password is being updated, encode it
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        
        return userRepository.save(user);
    }
    
    @CacheEvict(value = "users", allEntries = true)
    public void deleteUser(String id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}