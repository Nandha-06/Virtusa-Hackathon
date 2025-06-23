package com.devcoders.dlvery.controller;

import com.devcoders.dlvery.dto.ApiResponse;
import com.devcoders.dlvery.dto.UserProfileUpdateRequest;
import com.devcoders.dlvery.model.User;
import com.devcoders.dlvery.model.UserRole;
import com.devcoders.dlvery.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.devcoders.dlvery.config.SecurityConfig;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private User user;
    private UserProfileUpdateRequest profileUpdateRequest;

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

        profileUpdateRequest = new UserProfileUpdateRequest();
        profileUpdateRequest.setFullName("Updated User");
        profileUpdateRequest.setEmail("updated@example.com");
        profileUpdateRequest.setPhoneNumber("+9876543210");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Test getAllUsers endpoint")
    void testGetAllUsers() throws Exception {
        // Given
        List<User> users = Arrays.asList(user);
        Page<User> userPage = new PageImpl<>(users, PageRequest.of(0, 10), users.size());
        given(userService.getAllUsers(any())).willReturn(userPage);

        // When & Then
        mockMvc.perform(get("/api/users")
                .param("page", "0")
                .param("size", "10")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].username", is("testuser")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Test getUserById endpoint")
    void testGetUserById() throws Exception {
        // Given
        given(userService.getUserById(anyString())).willReturn(user);

        // When & Then
        mockMvc.perform(get("/api/users/1")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", is("testuser")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Test getUserByUsername endpoint")
    void testGetUserByUsername() throws Exception {
        // Given
        given(userService.getUserByUsername(anyString())).willReturn(user);

        // When & Then
        mockMvc.perform(get("/api/users/username/testuser")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", is("testuser")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Test getUsersByRole endpoint")
    void testGetUsersByRole() throws Exception {
        // Given
        List<User> users = Arrays.asList(user);
        Page<User> userPage = new PageImpl<>(users, PageRequest.of(0, 10), users.size());
        given(userService.getUsersByRole(anyString(), any())).willReturn(userPage);

        // When & Then
        mockMvc.perform(get("/api/users/role/INVTEAM")
                .param("page", "0")
                .param("size", "10")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].role", is("INVTEAM")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Test updateUserProfile endpoint")
    void testUpdateUserProfile() throws Exception {
        // Given
        User updatedUser = new User();
        updatedUser.setId("1");
        updatedUser.setUsername("testuser");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setFullName("Updated User");
        updatedUser.setPhoneNumber("+9876543210");
        
        given(userService.getUserById(anyString())).willReturn(user);
        given(userService.updateUser(any(User.class))).willReturn(updatedUser);

        // When & Then
        mockMvc.perform(put("/api/users/1/profile")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profileUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", is("Updated User")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Test updateUserRole endpoint")
    void testUpdateUserRole() throws Exception {
        // Given
        User updatedUser = new User();
        updatedUser.setId("1");
        updatedUser.setUsername("testuser");
        updatedUser.setRole(UserRole.DLTEAM);
        
        given(userService.getUserById(anyString())).willReturn(user);
        given(userService.updateUser(any(User.class))).willReturn(updatedUser);

        // When & Then
        mockMvc.perform(put("/api/users/1/role")
                .with(csrf())
                .param("role", "DLTEAM"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.role", is("DLTEAM")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Test disableUser endpoint")
    void testDisableUser() throws Exception {
        // Given
        User disabledUser = new User();
        disabledUser.setId("1");
        disabledUser.setUsername("testuser");
        disabledUser.setEnabled(false);
        
        given(userService.getUserById(anyString())).willReturn(user);
        given(userService.updateUser(any(User.class))).willReturn(disabledUser);

        // When & Then
        mockMvc.perform(put("/api/users/1/disable")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.enabled", is(false)));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Test enableUser endpoint")
    void testEnableUser() throws Exception {
        // Given
        User enabledUser = new User();
        enabledUser.setId("1");
        enabledUser.setUsername("testuser");
        enabledUser.setEnabled(true);
        
        given(userService.getUserById(anyString())).willReturn(user);
        given(userService.updateUser(any(User.class))).willReturn(enabledUser);

        // When & Then
        mockMvc.perform(put("/api/users/1/enable")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.enabled", is(true)));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Test deleteUser endpoint")
    void testDeleteUser() throws Exception {
        // Given
        doNothing().when(userService).deleteUser(anyString());

        // When & Then
        mockMvc.perform(delete("/api/users/1")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("User deleted successfully")));
    }
}