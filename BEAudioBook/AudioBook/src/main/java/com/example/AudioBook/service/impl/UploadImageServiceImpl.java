package com.example.AudioBook.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.AudioBook.service.UploadImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UploadImageServiceImpl implements UploadImageService {
    private final Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        assert file.getOriginalFilename() != null;
        String fileType = file.getContentType();
        String publicValue = generatePublicValue(file.getOriginalFilename());
        String extension = getFileName(file.getOriginalFilename())[1];
        File fileUpload = convert(file);
        if (fileType != null && fileType.startsWith("image")) {
            cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("resource_type", "image", "public_id", publicValue));
        } else if (fileType != null && fileType.startsWith("audio")) {
            cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("resource_type", "video", "public_id", publicValue));
        } else {
            throw new RuntimeException("Unsupported file type");
        }

        cleanDisk(fileUpload);
        return cloudinary.url().resourceType(fileType.startsWith("image") ? "image" : "video").generate(StringUtils.join(publicValue, ".", extension));
    }

    private File convert(MultipartFile file) throws IOException {
        assert file.getOriginalFilename() != null;
        File convFile = new File(StringUtils.join(generatePublicValue(file.getOriginalFilename()), getFileName(file.getOriginalFilename())[1]));
        try (InputStream is = file.getInputStream()) {
            Files.copy(is, convFile.toPath());
        }
        return convFile;
    }

    private void cleanDisk(File file) {
        try {
            Path filePath = file.toPath();
            Files.delete(filePath);
        } catch (IOException e) {
            log.error("Error cleaning up file from disk: {}", e.getMessage());
        }
    }

    public String generatePublicValue(String originalName) {
        String fileName = getFileName(originalName)[0];
        return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);
    }

    public String[] getFileName(String originalName) {
        return originalName.split("\\.");
    }
}
