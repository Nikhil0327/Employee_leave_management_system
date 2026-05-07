package com.example.leave.controller;

import com.example.leave.dto.LeaveApplyRequest;
import com.example.leave.dto.LeaveBalanceResponse;
import com.example.leave.model.LeaveRequest;
import com.example.leave.service.LeaveService;
import com.example.leave.service.UserService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {
  private final LeaveService leaveService;
  private final UserService userService;

  public LeaveController(LeaveService leaveService, UserService userService) {
    this.leaveService = leaveService;
    this.userService = userService;
  }

  @PostMapping
  @PreAuthorize("hasRole('EMPLOYEE')")
  public LeaveRequest applyLeave(@Valid @RequestBody LeaveApplyRequest request, Authentication authentication) {
    return leaveService.applyLeave(userService.getCurrentUser(authentication), request);
  }

  @GetMapping("/my")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public List<LeaveRequest> myLeaves(Authentication authentication) {
    return leaveService.getMyLeaves(userService.getCurrentUser(authentication));
  }

  @GetMapping("/calendar")
  @PreAuthorize("hasAnyRole('EMPLOYEE','MANAGER','ADMIN')")
  public List<LeaveRequest> calendar(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
  ) {
    return leaveService.getCalendar(start, end);
  }

  @GetMapping("/balance")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public LeaveBalanceResponse balance(Authentication authentication) {
    return leaveService.getLeaveBalance(userService.getCurrentUser(authentication));
  }
}
