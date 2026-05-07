package com.example.leave.controller;

import com.example.leave.dto.LeaveDecisionRequest;
import com.example.leave.model.LeaveRequest;
import com.example.leave.model.LeaveStatus;
import com.example.leave.service.LeaveService;
import com.example.leave.service.UserService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {
  private final LeaveService leaveService;
  private final UserService userService;

  public ManagerController(LeaveService leaveService, UserService userService) {
    this.leaveService = leaveService;
    this.userService = userService;
  }

  @GetMapping("/leaves")
  @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
  public List<LeaveRequest> teamLeaves(
      Authentication authentication,
      @RequestParam(required = false) LeaveStatus status,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
      @RequestParam(required = false) String employeeName
  ) {
    return leaveService.getTeamLeaves(
        userService.getCurrentUser(authentication),
        status,
        from,
        to,
        employeeName
    );
  }

  @PostMapping("/leaves/{id}/approve")
  @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
  public LeaveRequest approve(
      @PathVariable String id,
      @Valid @RequestBody LeaveDecisionRequest request,
      Authentication authentication
  ) {
    return leaveService.approveLeave(id, userService.getCurrentUser(authentication), request.getRemarks());
  }

  @PostMapping("/leaves/{id}/reject")
  @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
  public LeaveRequest reject(
      @PathVariable String id,
      @Valid @RequestBody LeaveDecisionRequest request,
      Authentication authentication
  ) {
    return leaveService.rejectLeave(id, userService.getCurrentUser(authentication), request.getRemarks());
  }
}
