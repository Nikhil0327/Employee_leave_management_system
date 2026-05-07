package com.example.leave.dto;

import com.example.leave.model.LeaveType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Data;

@Data
public class LeaveApplyRequest {
  @NotNull
  private LeaveType leaveType;

  @NotNull
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate startDate;

  @NotNull
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate endDate;

  private boolean halfDay;
  private String reason;
  private String supportingDocPath;
}
