package com.example.leave.controller;

import com.example.leave.dto.FileUploadResponse;
import com.example.leave.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileController {
  private final FileStorageService fileStorageService;

  public FileController(FileStorageService fileStorageService) {
    this.fileStorageService = fileStorageService;
  }

  @PostMapping
  @PreAuthorize("isAuthenticated()")
  public FileUploadResponse upload(@RequestParam("file") MultipartFile file) {
    String fileName = fileStorageService.store(file);
    return FileUploadResponse.builder()
        .fileName(fileName)
        .url("/api/files/" + fileName)
        .build();
  }

  @GetMapping("/{filename:.+}")
  public ResponseEntity<Resource> download(@PathVariable("filename") String filename) {
    Resource resource = fileStorageService.loadAsResource(filename);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .body(resource);
  }
}
