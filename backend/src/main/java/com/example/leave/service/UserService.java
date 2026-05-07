package com.example.leave.service;

import com.example.leave.dto.UserCreateRequest;
import com.example.leave.dto.UserSummary;
import com.example.leave.exception.ApiException;
import com.example.leave.model.User;
import com.example.leave.model.UserRole;
import com.example.leave.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User getCurrentUser(Authentication authentication) {
    String email = authentication.getName();
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
  }

  public User createUser(UserCreateRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Email is already registered");
    }

    User user = User.builder()
        .fullName(request.getFullName())
        .email(request.getEmail())
        .passwordHash(passwordEncoder.encode(request.getPassword()))
        .role(request.getRole())
        .department(request.getDepartment())
      .managerId(resolveManagerId(request.getManagerId()))
        .active(true)
        .createdAt(Instant.now())
        .build();

    return userRepository.save(user);
  }

  public List<User> listUsers() {
    return userRepository.findAll();
  }

  public List<UserSummary> listManagers() {
    return userRepository.findByRoleIn(List.of(UserRole.MANAGER, UserRole.ADMIN))
        .stream()
        .map(user -> UserSummary.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .department(user.getDepartment())
            .role(user.getRole())
            .build())
        .toList();
  }

  public List<User> getTeamMembers(String managerId) {
    return userRepository.findByManagerId(managerId);
  }

  public User getById(String userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
  }

  private String resolveManagerId(String managerId) {
    if (managerId == null || managerId.isBlank()) {
      return null;
    }
    User manager = userRepository.findById(managerId)
        .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Manager not found"));
    if (manager.getRole() == UserRole.EMPLOYEE) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Manager must be MANAGER or ADMIN");
    }
    return managerId;
  }
}
