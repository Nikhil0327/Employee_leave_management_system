package com.example.leave.dto;

import java.util.Map;
import lombok.Data;

@Data
public class PolicyUpdateRequest {
  private int maxLeavesPerYear;
  private Map<String, Integer> typeLimits;
}
