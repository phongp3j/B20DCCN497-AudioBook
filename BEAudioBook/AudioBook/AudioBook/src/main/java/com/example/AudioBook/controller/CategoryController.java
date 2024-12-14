package com.example.AudioBook.controller;

import com.example.AudioBook.DTO.Category.CategoryRequest;
import com.example.AudioBook.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@CrossOrigin(origins = "http://127.0.0.1:5500")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @GetMapping("/category/getCategories")
    public ResponseEntity<?> getAllCategory(){
        return ResponseEntity.ok(categoryService.getAll());
    }

    @PostMapping("/category")
    public ResponseEntity<?> addCategory(@RequestBody CategoryRequest categoryRequest){
        return ResponseEntity.ok(categoryService.addCategory(categoryRequest));
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,@RequestBody CategoryRequest categoryRequest){
        return ResponseEntity.ok(categoryService.updateCategory(id,categoryRequest));
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id){
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}
