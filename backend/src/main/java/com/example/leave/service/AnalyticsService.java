package com.example.leave.service;

import com.example.leave.dto.AnalyticsSummaryResponse;
import com.example.leave.model.LeaveRequest;
import com.example.leave.model.LeaveStatus;
import com.example.leave.repository.LeaveRequestRepository;
import java.time.Month;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
  private final LeaveRequestRepository leaveRequestRepository;

  public AnalyticsService(LeaveRequestRepository leaveRequestRepository) {
    this.leaveRequestRepository = leaveRequestRepository;
  }

  public AnalyticsSummaryResponse getSummary(int year) {
    List<LeaveRequest> all = leaveRequestRepository.findAll();
    long pending = all.stream().filter(leave -> leave.getStatus() == LeaveStatus.PENDING).count();
    long approved = all.stream().filter(leave -> leave.getStatus() == LeaveStatus.APPROVED).count();
    long rejected = all.stream().filter(leave -> leave.getStatus() == LeaveStatus.REJECTED).count();

    Map<String, Long> monthlyCounts = new LinkedHashMap<>();
    for (int i = 1; i <= 12; i++) {
      Month month = Month.of(i);
      monthlyCounts.put(month.getDisplayName(TextStyle.SHORT, Locale.ENGLISH), 0L);
    }

    for (LeaveRequest leave : all) {
      if (leave.getAppliedAt() == null) {
        continue;
      }
      int appliedYear = leave.getAppliedAt().atZone(ZoneId.systemDefault()).getYear();
      if (appliedYear == year) {
        Month month = leave.getAppliedAt().atZone(ZoneId.systemDefault()).getMonth();
        String key = month.getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
        monthlyCounts.put(key, monthlyCounts.getOrDefault(key, 0L) + 1);
      }
    }

    return AnalyticsSummaryResponse.builder()
        .total(all.size())
        .pending(pending)
        .approved(approved)
        .rejected(rejected)
        .monthlyCounts(monthlyCounts)
        .build();
  }
}
