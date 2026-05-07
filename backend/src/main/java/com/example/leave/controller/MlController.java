package com.example.leave.controller;

import com.example.leave.model.User;
import com.example.leave.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/admin/ml")
@PreAuthorize("hasRole('ADMIN')")
public class MlController {

    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();

    public MlController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/predict")
    public List<Map<String, Object>> getPredictions() {
        List<User> users = userService.listUsers();
        List<Map<String, Object>> results = new ArrayList<>();
        Random random = new Random();

        for (User u : users) {
            // Data mocking to fulfill ML Model constraints without breaking existing User collections
            int age = 22 + random.nextInt(40);
            int salary = 30000 + random.nextInt(70000);
            int overtime = random.nextInt(2);
            int distance = 1 + random.nextInt(25);
            int experience = 1 + random.nextInt(20);

            Map<String, Object> request = new HashMap<>();
            request.put("age", age);
            request.put("salary", salary);
            request.put("overtime", overtime);
            request.put("distance", distance);
            request.put("experience", experience);

            Map<String, Object> result = new HashMap<>();
            result.put("userId", u.getId());
            result.put("name", u.getFullName());
            result.put("department", u.getDepartment());
            result.put("age", age);
            result.put("salary", salary);
            result.put("overtime", overtime);
            result.put("distance", distance);
            result.put("experience", experience);

            try {
                // Integration with Local Flask prediction server
                Map response = restTemplate.postForObject("https://employee-leave-management-system-ml.onrender.com",request,Map.class);
                
                if (response != null) {
                    result.put("prediction", response.get("prediction"));
                    result.put("risk", response.get("risk"));
                    result.put("probability", response.get("probability"));
                } else {
                    result.put("risk", "Unknown");
                }
            } catch (Exception e) {
                result.put("risk", "Error");
            }
            results.add(result);
        }
        return results;
    }
}
