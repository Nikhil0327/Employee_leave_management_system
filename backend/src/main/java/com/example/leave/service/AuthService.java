package com.example.leave.service;

import com.example.leave.config.JwtService;
import com.example.leave.dto.AuthResponse;
import com.example.leave.dto.LoginRequest;
import com.example.leave.dto.RegisterRequest;
import com.example.leave.exception.ApiException;
import com.example.leave.model.User;
import com.example.leave.model.UserRole;
import com.example.leave.repository.UserRepository;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;
  private final AuthenticationManager authenticationManager;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      UserDetailsService userDetailsService,
      AuthenticationManager authenticationManager
  ) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.userDetailsService = userDetailsService;
    this.authenticationManager = authenticationManager;
  }

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Email is already registered");
    }

    User user = User.builder()
        .fullName(request.getFullName())
        .email(request.getEmail())
        .passwordHash(passwordEncoder.encode(request.getPassword()))
        .role(UserRole.EMPLOYEE)
        .department(request.getDepartment())
      .managerId(resolveManagerId(request.getManagerId()))
        .active(true)
        .createdAt(Instant.now())
        .build();

    userRepository.save(user);

    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
    String token = jwtService.generateToken(userDetails);

    return AuthResponse.builder()
        .token(token)
        .fullName(user.getFullName())
        .email(user.getEmail())
        .role(user.getRole())
        .build();
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
    );

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
    String token = jwtService.generateToken(userDetails);

    return AuthResponse.builder()
        .token(token)
        .fullName(user.getFullName())
        .email(user.getEmail())
        .role(user.getRole())
        .build();
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
