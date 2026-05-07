package com.example.leave.dto;

import com.example.leave.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserCreateRequest {
  @NotBlank
  private String fullName;

  @Email
  @NotBlank
  private String email;

  @NotBlank
  private String password;

  @NotNull
  private UserRole role;

  private String department;
  private String managerId;
}
