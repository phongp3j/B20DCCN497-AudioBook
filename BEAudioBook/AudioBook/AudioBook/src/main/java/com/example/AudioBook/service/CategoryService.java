package com.example.AudioBook.service;

import com.example.AudioBook.DTO.Category.CategoryRequest;
import com.example.AudioBook.DTO.Category.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryResponseDTO> getAll();
    String addCategory(CategoryRequest categoryRequest);

    String updateCategory(Long id, CategoryRequest categoryRequest);
    String deleteCategory(Long id);
}
