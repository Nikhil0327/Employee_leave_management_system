package com.example.leave.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryResponse {
  private long total;
  private long pending;
  private long approved;
  private long rejected;
  private Map<String, Long> monthlyCounts;
}
