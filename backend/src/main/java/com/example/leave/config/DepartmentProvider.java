package com.example.leave.config;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DepartmentProvider {
  private final List<String> departments;

  public DepartmentProvider(@Value("${app.departments:HR,Engineering,Sales,Finance,Operations}") List<String> departments) {
    this.departments = departments;
  }

  public List<String> getDepartments() {
    return departments;
  }
}
