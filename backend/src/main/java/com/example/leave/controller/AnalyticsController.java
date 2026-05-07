package com.example.leave.controller;

import com.example.leave.dto.AnalyticsSummaryResponse;
import com.example.leave.service.AnalyticsService;
import java.time.Year;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
  private final AnalyticsService analyticsService;

  public AnalyticsController(AnalyticsService analyticsService) {
    this.analyticsService = analyticsService;
  }

  @GetMapping("/summary")
  @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
  public AnalyticsSummaryResponse summary(@RequestParam(required = false) Integer year) {
    int targetYear = year == null ? Year.now().getValue() : year;
    return analyticsService.getSummary(targetYear);
  }
}
