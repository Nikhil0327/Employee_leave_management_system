package com.example.leave.repository;

import com.example.leave.model.LeaveRequest;
import com.example.leave.model.LeaveStatus;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {
  List<LeaveRequest> findByEmployeeIdOrderByAppliedAtDesc(String employeeId);
  List<LeaveRequest> findByEmployeeIdIn(List<String> employeeIds);
  List<LeaveRequest> findByStatus(LeaveStatus status);
}