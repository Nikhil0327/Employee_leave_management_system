package com.example.leave.service;

import com.example.leave.dto.PolicyUpdateRequest;
import com.example.leave.model.LeavePolicy;
import com.example.leave.repository.LeavePolicyRepository;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class PolicyService {
  private final LeavePolicyRepository leavePolicyRepository;

  public PolicyService(LeavePolicyRepository leavePolicyRepository) {
    this.leavePolicyRepository = leavePolicyRepository;
  }

  public LeavePolicy getPolicy() {
    return leavePolicyRepository.findTopByOrderByUpdatedAtDesc()
        .orElseGet(this::createDefaultPolicy);
  }

  public LeavePolicy updatePolicy(PolicyUpdateRequest request) {
    LeavePolicy policy = getPolicy();
    policy.setMaxLeavesPerYear(request.getMaxLeavesPerYear());
    policy.setTypeLimits(request.getTypeLimits());
    policy.setUpdatedAt(Instant.now());
    return leavePolicyRepository.save(policy);
  }

  private LeavePolicy createDefaultPolicy() {
    Map<String, Integer> limits = new HashMap<>();
    limits.put("CASUAL", 10);
    limits.put("SICK", 10);
    limits.put("PAID", 4);
    limits.put("UNPAID", 0);

    LeavePolicy policy = LeavePolicy.builder()
        .maxLeavesPerYear(24)
        .typeLimits(limits)
        .updatedAt(Instant.now())
        .build();
    return leavePolicyRepository.save(policy);
  }
}
