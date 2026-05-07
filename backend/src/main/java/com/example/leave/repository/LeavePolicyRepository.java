package com.example.leave.repository;

import com.example.leave.model.LeavePolicy;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LeavePolicyRepository extends MongoRepository<LeavePolicy, String> {
  Optional<LeavePolicy> findTopByOrderByUpdatedAtDesc();
}

