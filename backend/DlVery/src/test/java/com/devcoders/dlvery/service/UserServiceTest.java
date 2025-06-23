package com.devcoders.dlvery.service;

import com.devcoders.dlvery.dto.RegisterRequest;
import com.devcoders.dlvery.exception.ResourceNotFoundException;
import com.devcoders.dlvery.model.User;
import com.devcoders.dlvery.model.UserRole;
import com.devcoders.dlvery.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("1");
        user.setUsername("testuser");
        user.setPassword("encodedPassword");
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setRole(UserRole.INVTEAM);
        user.setEnabled(true);
        user.setPhoneNumber("+1234567890");

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password");
        registerRequest.setEmail("test@example.com");
        registerRequest.setFullName("Test User");
        registerRequest.setRole(UserRole.INVTEAM);
        registerRequest.setPhoneNumber("+1234567890");
    }

    @Test
    @DisplayName("Test registerUser with valid data")
    void testRegisterUser() {
        // Given
        given(userRepository.existsByUsername(anyString())).willReturn(false);
        given(userRepository.existsByEmail(anyString())).willReturn(false);
        given(passwordEncoder.encode(anyString())).willReturn("encodedPassword");
        given(userRepository.save(any(User.class))).willReturn(user);

        // When
        User savedUser = userService.registerUser(registerRequest);

        // Then
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getUsername()).isEqualTo("testuser");
        assertThat(savedUser.getEmail()).isEqualTo("test@example.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Test registerUser with existing username")
    void testRegisterUserWithExistingUsername() {
        // Given
        given(userRepository.existsByUsername(anyString())).willReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser(registerRequest);
        });

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Test getAllUsers")
    void testGetAllUsers() {
        // Given
        List<User> users = Arrays.asList(user);
        given(userRepository.findAll()).willReturn(users);

        // When
        List<User> foundUsers = userService.getAllUsers();

        // Then
        assertThat(foundUsers).isNotNull();
        assertThat(foundUsers.size()).isEqualTo(1);
    }

    @Test
    @DisplayName("Test getAllUsers with pagination")
    void testGetAllUsersWithPagination() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<User> users = Arrays.asList(user);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());
        given(userRepository.findAll(pageable)).willReturn(userPage);

        // When
        Page<User> foundUsers = userService.getAllUsers(pageable);

        // Then
        assertThat(foundUsers).isNotNull();
        assertThat(foundUsers.getContent().size()).isEqualTo(1);
        assertThat(foundUsers.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("Test getUserById with existing id")
    void testGetUserById() {
        // Given
        given(userRepository.findById(anyString())).willReturn(Optional.of(user));

        // When
        User foundUser = userService.getUserById("1");

        // Then
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getId()).isEqualTo("1");
    }

    @Test
    @DisplayName("Test getUserById with non-existing id")
    void testGetUserByIdNotFound() {
        // Given
        given(userRepository.findById(anyString())).willReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById("999");
        });
    }

    @Test
    @DisplayName("Test updateUser")
    void testUpdateUser() {
        // Given
        User updatedUser = new User();
        updatedUser.setId("1");
        updatedUser.setUsername("testuser");
        updatedUser.setPassword("newPassword");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setFullName("Updated User");
        updatedUser.setRole(UserRole.DLTEAM);

        given(userRepository.findById(anyString())).willReturn(Optional.of(user));
        given(passwordEncoder.encode(anyString())).willReturn("encodedNewPassword");
        given(userRepository.save(any(User.class))).willReturn(updatedUser);

        // When
        User result = userService.updateUser(updatedUser);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("updated@example.com");
        assertThat(result.getFullName()).isEqualTo("Updated User");
        assertThat(result.getRole()).isEqualTo(UserRole.DLTEAM);
        verify(passwordEncoder, times(1)).encode(anyString());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Test deleteUser")
    void testDeleteUser() {
        // Given
        given(userRepository.findById(anyString())).willReturn(Optional.of(user));
        doNothing().when(userRepository).delete(any(User.class));

        // When
        userService.deleteUser("1");

        // Then
        verify(userRepository, times(1)).delete(any(User.class));
    }
}