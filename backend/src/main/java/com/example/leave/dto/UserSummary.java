package com.example.leave.dto;

import com.example.leave.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummary {
  private String id;
  private String fullName;
  private String email;
  private String department;
  private UserRole role;
}
