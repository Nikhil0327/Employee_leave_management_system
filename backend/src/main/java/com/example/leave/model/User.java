package com.example.leave.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("users")
public class User {
  @Id
  private String id;

  @NotBlank
  private String fullName;

  @Email
  @NotBlank
  private String email;

  @JsonIgnore
  @NotBlank
  private String passwordHash;

  @NotNull
  private UserRole role;

  private String department;
  private String managerId;
  private boolean active;
  private Instant createdAt;
}
