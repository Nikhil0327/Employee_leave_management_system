package com.example.leave.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
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
@Document("leave_requests")
public class LeaveRequest {
  @Id
  private String id;

  @NotNull
  private String employeeId;

  @NotNull
  private String employeeName;

  private String department;

  @NotNull
  private LeaveType leaveType;

  @NotNull
  private LeaveStatus status;

  @NotNull
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate startDate;

  @NotNull
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate endDate;

  private boolean halfDay;
  private double totalDays;
  private String reason;
  private String supportingDocPath;
  private String remarks;
  private String approverId;
  private Instant appliedAt;
  private Instant decisionAt;
}
