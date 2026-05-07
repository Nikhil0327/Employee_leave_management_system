package com.example.leave.service;

import com.example.leave.model.LeaveRequest;
import com.example.leave.repository.LeaveRequestRepository;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
  private final LeaveRequestRepository leaveRequestRepository;

  public ReportService(LeaveRequestRepository leaveRequestRepository) {
    this.leaveRequestRepository = leaveRequestRepository;
  }

  public List<LeaveRequest> getMonthlyReport(int year, int month) {
    YearMonth yearMonth = YearMonth.of(year, month);
    LocalDate start = yearMonth.atDay(1);
    LocalDate end = yearMonth.atEndOfMonth();

    return leaveRequestRepository.findAll().stream()
        .filter(leave -> leave.getStartDate() != null)
        .filter(leave -> !leave.getStartDate().isAfter(end) && !leave.getEndDate().isBefore(start))
        .toList();
  }

  public String buildCsv(List<LeaveRequest> leaves) {
    StringBuilder sb = new StringBuilder();
    sb.append("Employee,Department,Type,Status,Start Date,End Date,Total Days\n");
    for (LeaveRequest leave : leaves) {
      sb.append(safe(leave.getEmployeeName())).append(",")
          .append(safe(leave.getDepartment())).append(",")
          .append(safe(String.valueOf(leave.getLeaveType()))).append(",")
          .append(safe(String.valueOf(leave.getStatus()))).append(",")
          .append(safe(String.valueOf(leave.getStartDate()))).append(",")
          .append(safe(String.valueOf(leave.getEndDate()))).append(",")
          .append(leave.getTotalDays()).append("\n");
    }
    return sb.toString();
  }

  private String safe(String value) {
    if (value == null) {
      return "";
    }
    return value.replace(",", " ");
  }
}
