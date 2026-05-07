package com.example.leave.service;

import com.example.leave.model.LeaveRequest;
import com.example.leave.model.User;
import com.example.leave.model.UserRole;
import com.example.leave.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
  private static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);

  private final String mode;
  private final String fromAddress;
  private final JavaMailSender mailSender;
  private final UserRepository userRepository;

  public NotificationService(
      @Value("${app.notifications.mode:log}") String mode,
      @Value("${app.notifications.from:no-reply@leave.local}") String fromAddress,
      ObjectProvider<JavaMailSender> mailSender,
      UserRepository userRepository
  ) {
    this.mode = mode;
    this.fromAddress = fromAddress;
    this.mailSender = mailSender.getIfAvailable();
    this.userRepository = userRepository;
  }

  @PostConstruct
  void logConfiguration() {
    LOGGER.info("Notification mode: {}", mode);
    LOGGER.info("Notification from address: {}", fromAddress);
    LOGGER.info("Mail sender configured: {}", mailSender != null);
  }

  public void leaveApplied(LeaveRequest leave) {
    String subject = "Leave request submitted";
    String body = buildLeaveDetails(leave, "A new leave request has been submitted.");

    Optional<User> employee = userRepository.findById(leave.getEmployeeId());
    if (employee.isPresent()) {
      sendNotification(employee.get().getEmail(), subject, body);
      String managerId = employee.get().getManagerId();
      if (managerId != null && !managerId.isBlank()) {
        userRepository.findById(managerId)
            .map(User::getEmail)
            .ifPresent(email -> sendNotification(email, subject, body));
      } else {
        notifyFallbackApprovers(subject, body);
      }
    } else {
      LOGGER.warn("Employee not found for leave {}", leave.getId());
    }
  }

  public void leaveDecided(LeaveRequest leave) {
    String subject = "Leave request " + leave.getStatus().name().toLowerCase();
    String body = buildLeaveDetails(leave, "Your leave request has been " + leave.getStatus().name().toLowerCase() + ".");

    userRepository.findById(leave.getEmployeeId())
        .map(User::getEmail)
        .ifPresent(email -> sendNotification(email, subject, body));
  }

  private void notifyFallbackApprovers(String subject, String body) {
    List<User> approvers = userRepository.findByRoleIn(List.of(UserRole.MANAGER, UserRole.ADMIN));
    Set<String> emails = approvers.stream()
        .map(User::getEmail)
        .filter(email -> email != null && !email.isBlank())
        .collect(Collectors.toSet());
    emails.forEach(email -> sendNotification(email, subject, body));
  }

  private String buildLeaveDetails(LeaveRequest leave, String intro) {
    return intro + "\n\n"
        + "Employee: " + leave.getEmployeeName() + "\n"
        + "Type: " + leave.getLeaveType() + "\n"
        + "Dates: " + leave.getStartDate() + " to " + leave.getEndDate() + "\n"
        + "Reason: " + (leave.getReason() == null ? "-" : leave.getReason()) + "\n"
        + "Status: " + leave.getStatus() + "\n";
  }

  private void sendNotification(String to, String subject, String body) {
    if (to == null || to.isBlank()) {
      return;
    }

    if (!"mail".equalsIgnoreCase(mode)) {
      LOGGER.info("[NOTIFY:{}] {} -> {}", mode, subject, to);
      return;
    }

    if (mailSender == null) {
      LOGGER.warn("Mail sender not configured; falling back to log for {}", to);
      LOGGER.info("[NOTIFY:log] {} -> {}", subject, to);
      return;
    }

    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(to);
      message.setFrom(fromAddress);
      message.setSubject(subject);
      message.setText(body);
      mailSender.send(message);
    } catch (Exception ex) {
      LOGGER.warn("Failed to send email to {}: {}", to, ex.getMessage());
    }
  }
}
