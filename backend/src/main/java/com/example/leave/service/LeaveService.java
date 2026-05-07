package com.example.leave.service;

import com.example.leave.dto.LeaveApplyRequest;
import com.example.leave.dto.LeaveBalanceResponse;
import com.example.leave.exception.ApiException;
import com.example.leave.model.LeavePolicy;
import com.example.leave.model.LeaveRequest;
import com.example.leave.model.LeaveStatus;
import com.example.leave.model.User;
import com.example.leave.repository.LeaveRequestRepository;
import com.example.leave.util.DateUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class LeaveService {

  private final LeaveRequestRepository leaveRequestRepository;
  private final UserService userService;
  private final PolicyService policyService;
  private final NotificationService notificationService;
  private final MongoTemplate mongoTemplate;

  public LeaveService(
      LeaveRequestRepository leaveRequestRepository,
      UserService userService,
      PolicyService policyService,
      NotificationService notificationService,
      MongoTemplate mongoTemplate
  ) {
    this.leaveRequestRepository = leaveRequestRepository;
    this.userService = userService;
    this.policyService = policyService;
    this.notificationService = notificationService;
    this.mongoTemplate = mongoTemplate;
  }

  public LeaveRequest applyLeave(User user, LeaveApplyRequest request) {

    double totalDays = DateUtils.calculateLeaveDays(
        request.getStartDate(),
        request.getEndDate(),
        request.isHalfDay()
    );

    LeaveRequest leave = LeaveRequest.builder()
        .employeeId(user.getId())
        .employeeName(user.getFullName())
        .department(user.getDepartment())
        .leaveType(request.getLeaveType())
        .status(LeaveStatus.PENDING)
        .startDate(request.getStartDate())
        .endDate(request.getEndDate())
        .halfDay(request.isHalfDay())
        .totalDays(totalDays)
        .reason(request.getReason())
        .supportingDocPath(request.getSupportingDocPath())
        .appliedAt(Instant.now())
        .build();

    LeaveRequest saved = leaveRequestRepository.save(leave);

    notificationService.leaveApplied(saved);

    return saved;
  }

  public List<LeaveRequest> getMyLeaves(User user) {

    return leaveRequestRepository
        .findByEmployeeIdOrderByAppliedAtDesc(user.getId());
  }

  public List<LeaveRequest> getCalendar(
      LocalDate start,
      LocalDate end
  ) {

    Criteria criteria = Criteria.where("status")
        .is(LeaveStatus.APPROVED)
        .and("startDate").lte(end)
        .and("endDate").gte(start);

    Query query = new Query(criteria);

    return mongoTemplate.find(query, LeaveRequest.class);
  }

  public LeaveBalanceResponse getLeaveBalance(User user) {

    LeavePolicy policy = policyService.getPolicy();

    int year = Year.now().getValue();

    List<LeaveRequest> approved =
        leaveRequestRepository
            .findByEmployeeIdOrderByAppliedAtDesc(user.getId())
            .stream()
            .filter(
                leave ->
                    leave.getStatus() == LeaveStatus.APPROVED
            )
            .filter(
                leave ->
                    leave.getStartDate() != null &&
                    leave.getStartDate().getYear() == year
            )
            .toList();

    double used =
        approved.stream()
            .mapToDouble(LeaveRequest::getTotalDays)
            .sum();

    double max = policy.getMaxLeavesPerYear();

    double remaining = Math.max(max - used, 0.0);

    return LeaveBalanceResponse.builder()
        .maxLeaves(max)
        .usedLeaves(used)
        .remainingLeaves(remaining)
        .build();
  }

  public List<LeaveRequest> getTeamLeaves(
      User manager,
      LeaveStatus status,
      LocalDate from,
      LocalDate to,
      String employeeName
  ) {

    // ADMIN can view ALL leaves
    if ("ADMIN".equals(manager.getRole().name())) {

      return getAllLeaves(
          status,
          from,
          to,
          null,
          employeeName
      );
    }

    // MANAGER sees only assigned employees
    List<User> team =
        userService.getTeamMembers(manager.getId());

    if (team.isEmpty()) {
      return List.of();
    }

    List<String> employeeIds =
        team.stream()
            .map(User::getId)
            .toList();

    Criteria criteria =
        Criteria.where("employeeId").in(employeeIds);

    return filterLeaves(
        criteria,
        status,
        from,
        to,
        null,
        employeeName
    );
  }

  public List<LeaveRequest> getAllLeaves(
      LeaveStatus status,
      LocalDate from,
      LocalDate to,
      String department,
      String employeeName
  ) {

    Criteria criteria = new Criteria();

    return filterLeaves(
        criteria,
        status,
        from,
        to,
        department,
        employeeName
    );
  }

  public LeaveRequest approveLeave(
      String leaveId,
      User approver,
      String remarks
  ) {

    LeaveRequest leave =
        getLeaveForDecision(leaveId, approver);

    leave.setStatus(LeaveStatus.APPROVED);
    leave.setRemarks(remarks);
    leave.setApproverId(approver.getId());
    leave.setDecisionAt(Instant.now());

    LeaveRequest saved =
        leaveRequestRepository.save(leave);

    notificationService.leaveDecided(saved);

    return saved;
  }

  public LeaveRequest rejectLeave(
      String leaveId,
      User approver,
      String remarks
  ) {

    LeaveRequest leave =
        getLeaveForDecision(leaveId, approver);

    leave.setStatus(LeaveStatus.REJECTED);
    leave.setRemarks(remarks);
    leave.setApproverId(approver.getId());
    leave.setDecisionAt(Instant.now());

    LeaveRequest saved =
        leaveRequestRepository.save(leave);

    notificationService.leaveDecided(saved);

    return saved;
  }

  private LeaveRequest getLeaveForDecision(
      String leaveId,
      User approver
  ) {

    LeaveRequest leave =
        leaveRequestRepository.findById(leaveId)
            .orElseThrow(
                () ->
                    new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Leave request not found"
                    )
            );

    if (leave.getStatus() != LeaveStatus.PENDING) {

      throw new ApiException(
          HttpStatus.BAD_REQUEST,
          "Leave is already decided"
      );
    }

    // MANAGER restrictions
    if ("MANAGER".equals(approver.getRole().name())) {

      List<User> team =
          userService.getTeamMembers(approver.getId());

      Set<String> teamIds =
          team.stream()
              .map(User::getId)
              .collect(Collectors.toSet());

      if (!teamIds.contains(leave.getEmployeeId())) {

        throw new ApiException(
            HttpStatus.FORBIDDEN,
            "Not allowed to approve this leave"
        );
      }
    }

    return leave;
  }

  private List<LeaveRequest> filterLeaves(
      Criteria baseCriteria,
      LeaveStatus status,
      LocalDate from,
      LocalDate to,
      String department,
      String employeeName
  ) {

    List<Criteria> criteriaList = new ArrayList<>();

    if (
        baseCriteria.getCriteriaObject() != null &&
        !baseCriteria.getCriteriaObject().isEmpty()
    ) {
      criteriaList.add(baseCriteria);
    }

    if (status != null) {

      criteriaList.add(
          Criteria.where("status").is(status)
      );
    }

    if (department != null && !department.isBlank()) {

      criteriaList.add(
          Criteria.where("department").is(department)
      );
    }

    if (
        employeeName != null &&
        !employeeName.isBlank()
    ) {

      criteriaList.add(
          Criteria.where("employeeName")
              .regex(employeeName, "i")
      );
    }

    if (from != null && to != null) {

      criteriaList.add(
          Criteria.where("startDate")
              .lte(to)
              .and("endDate")
              .gte(from)
      );

    } else if (from != null) {

      criteriaList.add(
          Criteria.where("endDate").gte(from)
      );

    } else if (to != null) {

      criteriaList.add(
          Criteria.where("startDate").lte(to)
      );
    }

    Criteria finalCriteria = new Criteria();

    if (!criteriaList.isEmpty()) {

      finalCriteria.andOperator(
          criteriaList.toArray(new Criteria[0])
      );
    }

    Query query = new Query(finalCriteria);

    return mongoTemplate.find(
        query,
        LeaveRequest.class
    );
  }
}
