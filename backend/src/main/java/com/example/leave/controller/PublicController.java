package com.example.leave.controller;

import com.example.leave.config.DepartmentProvider;
import com.example.leave.dto.RegistrationMetaResponse;
import com.example.leave.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicController {
  private final UserService userService;
  private final DepartmentProvider departmentProvider;

  public PublicController(UserService userService, DepartmentProvider departmentProvider) {
    this.userService = userService;
    this.departmentProvider = departmentProvider;
  }

  @GetMapping("/registration-meta")
  public RegistrationMetaResponse registrationMeta() {
    return RegistrationMetaResponse.builder()
        .departments(departmentProvider.getDepartments())
        .managers(userService.listManagers())
        .build();
  }
}
