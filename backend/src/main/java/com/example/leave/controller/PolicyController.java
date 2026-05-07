package com.example.leave.controller;

import com.example.leave.dto.PolicyUpdateRequest;
import com.example.leave.model.LeavePolicy;
import com.example.leave.service.PolicyService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/policy")
public class PolicyController {
  private final PolicyService policyService;

  public PolicyController(PolicyService policyService) {
    this.policyService = policyService;
  }

  @GetMapping
  public LeavePolicy getPolicy() {
    return policyService.getPolicy();
  }

  @PutMapping
  @PreAuthorize("hasRole('ADMIN')")
  public LeavePolicy update(@Valid @RequestBody PolicyUpdateRequest request) {
    return policyService.updatePolicy(request);
  }
}
