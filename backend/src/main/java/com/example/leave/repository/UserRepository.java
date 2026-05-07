package com.example.leave.repository;

import com.example.leave.model.User;
import com.example.leave.model.UserRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
  Optional<User> findByEmail(String email);
  boolean existsByEmail(String email);
  List<User> findByManagerId(String managerId);
  List<User> findByDepartment(String department);
  List<User> findByRoleIn(List<UserRole> roles);
}