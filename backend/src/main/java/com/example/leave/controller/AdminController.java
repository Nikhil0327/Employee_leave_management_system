package com.example.leave.controller;

import com.example.leave.dto.LeaveDecisionRequest;
import com.example.leave.dto.UserCreateRequest;
import com.example.leave.model.LeaveRequest;
import com.example.leave.model.LeaveStatus;
import com.example.leave.model.User;
import com.example.leave.service.LeaveService;
import com.example.leave.service.UserService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

  private final LeaveService leaveService;
  private final UserService userService;

  public AdminController(LeaveService leaveService, UserService userService) {
    this.leaveService = leaveService;
    this.userService = userService;
  }

  @GetMapping("/leaves")
  public List<LeaveRequest> allLeaves(
      @RequestParam(required = false) LeaveStatus status,
      @RequestParam(required = false)
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
      LocalDate from,
      @RequestParam(required = false)
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
      LocalDate to,
      @RequestParam(required = false) String department,
      @RequestParam(required = false) String employeeName
  ) {
    return leaveService.getAllLeaves(status, from, to, department, employeeName);
  }

  @PostMapping("/leaves/{id}/approve")
  public LeaveRequest approveLeave(
      @PathVariable String id,
      @RequestBody LeaveDecisionRequest request,
      Authentication authentication
  ) {
    return leaveService.approveLeave(
        id,
        userService.getCurrentUser(authentication),
        request.getRemarks()
    );
  }

  @PostMapping("/leaves/{id}/reject")
  public LeaveRequest rejectLeave(
      @PathVariable String id,
      @RequestBody LeaveDecisionRequest request,
      Authentication authentication
  ) {
    return leaveService.rejectLeave(
        id,
        userService.getCurrentUser(authentication),
        request.getRemarks()
    );
  }

  @GetMapping("/users")
  public List<User> listUsers() {
    return userService.listUsers();
  }

  @PostMapping("/users")
  public User createUser(@Valid @RequestBody UserCreateRequest request) {
    return userService.createUser(request);
  }
}
