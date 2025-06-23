package com.devcoders.dlvery.controller;

import com.devcoders.dlvery.dto.ApiResponse;
import com.devcoders.dlvery.exception.ResourceNotFoundException;
import com.devcoders.dlvery.model.User;
import com.devcoders.dlvery.model.UserRole;
import com.devcoders.dlvery.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    private final UserService userService;

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users", description = "Retrieves all users with pagination support")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden, authentication required", content = @Content)
    })
    public ResponseEntity<ApiResponse<Page<User>>> getAllUsers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "username") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<User> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by ID", description = "Retrieves a user by their ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden, authentication required")
    })
    public ResponseEntity<ApiResponse<User>> getUserById(
            @Parameter(description = "User ID", required = true) @PathVariable String id
    ) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/users/username/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by username", description = "Retrieves a user by their username")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden, authentication required")
    })
    public ResponseEntity<ApiResponse<User>> getUserByUsername(
            @Parameter(description = "Username", required = true) @PathVariable String username
    ) {
        try {
            User user = userService.getUserByUsername(username);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/users/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get users by role", description = "Retrieves all users with a specific role")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden, authentication required")
    })
    public ResponseEntity<ApiResponse<Page<User>>> getUsersByRole(
            @Parameter(description = "User role", required = true) @PathVariable String role,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "username") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String direction
    ) {
        try {
            Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            
            Page<User> users = userService.getUsersByRole(role, pageable);
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/users/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Disable user", description = "Disables a user account")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User disabled successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden, authentication required")
    })
    public ResponseEntity<ApiResponse<User>> disableUser(
            @Parameter(description = "User ID", required = true) @PathVariable String id
    ) {
        try {
            User user = userService.getUserById(id);
            user.setEnabled(false);
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(ApiResponse.success("User disabled successfully", updatedUser));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/users/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enable user", description = "Enables a user account")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User enabled successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden, authentication required")
    })
    public ResponseEntity<ApiResponse<User>> enableUser(
            @Parameter(description = "User ID", required = true) @PathVariable String id
    ) {
        try {
            User user = userService.getUserById(id);
            user.setEnabled(true);
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(ApiResponse.success("User enabled successfully", updatedUser));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user role", description = "Updates a user's role")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User role updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden, authentication required")
    })
    public ResponseEntity<ApiResponse<User>> updateUserRole(
            @Parameter(description = "User ID", required = true) @PathVariable String id,
            @Parameter(description = "New role", required = true) @RequestParam String role
    ) {
        try {
            User user = userService.getUserById(id);
            try {
                user.setRole(UserRole.valueOf(role.toUpperCase()));
                User updatedUser = userService.updateUser(user);
                return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updatedUser));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid role: " + role));
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users/profile")
    @Operation(summary = "Get user profile", description = "Retrieves the profile of the authenticated user")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<ApiResponse<User>> getUserProfile(
            @Parameter(description = "Username", required = true) @RequestParam String username
    ) {
        try {
            User user = userService.getUserByUsername(username);
            // Remove sensitive information
            user.setPassword(null);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/users/profile")
    @Operation(summary = "Update user profile", description = "Updates the profile of the authenticated user")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<ApiResponse<User>> updateUserProfile(
            @Parameter(description = "Updated user information", required = true) @Valid @RequestBody User updatedUser,
            @Parameter(description = "Username", required = true) @RequestParam String username
    ) {
        try {
            User existingUser = userService.getUserByUsername(username);
            
            // Only update allowed fields
            existingUser.setFullName(updatedUser.getFullName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
            
            User savedUser = userService.updateUser(existingUser);
            // Remove sensitive information
            savedUser.setPassword(null);
            
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", savedUser));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user", description = "Deletes a user account")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "User deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden, authentication required")
    })
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "User ID", required = true) @PathVariable String id
    ) {
        try {
            // First check if the user exists
            userService.getUserById(id);
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}