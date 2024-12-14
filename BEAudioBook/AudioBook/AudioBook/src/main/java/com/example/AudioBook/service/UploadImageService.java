package com.example.AudioBook.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UploadImageService {
    String uploadFile(MultipartFile file) throws IOException;
}
