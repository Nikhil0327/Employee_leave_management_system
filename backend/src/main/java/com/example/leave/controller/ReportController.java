package com.example.leave.controller;

import com.example.leave.model.LeaveRequest;
import com.example.leave.service.ReportService;
import java.time.YearMonth;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
  private final ReportService reportService;

  public ReportController(ReportService reportService) {
    this.reportService = reportService;
  }

  @GetMapping("/monthly")
  @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
  public List<LeaveRequest> monthlyReport(@RequestParam int year, @RequestParam int month) {
    return reportService.getMonthlyReport(year, month);
  }

  @GetMapping(value = "/monthly.csv", produces = "text/csv")
  @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
  public ResponseEntity<String> monthlyReportCsv(@RequestParam int year, @RequestParam int month) {
    List<LeaveRequest> leaves = reportService.getMonthlyReport(year, month);
    String body = reportService.buildCsv(leaves);
    String fileName = "leave-report-" + YearMonth.of(year, month) + ".csv";
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
        .contentType(MediaType.parseMediaType("text/csv"))
        .body(body);
  }
}
