package com.example.leave.model;

import java.time.Instant;
import java.util.Map;
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
@Document("leave_policies")
public class LeavePolicy {
  @Id
  private String id;

  private int maxLeavesPerYear;
  private Map<String, Integer> typeLimits;
  private Instant updatedAt;
}
