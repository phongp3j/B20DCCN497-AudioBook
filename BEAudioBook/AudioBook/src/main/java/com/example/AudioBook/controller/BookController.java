package com.example.AudioBook.controller;

import com.example.AudioBook.DTO.Book.BookRequest;
import com.example.AudioBook.service.BookService;
import com.example.AudioBook.service.UploadImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class BookController {
    @Autowired
    private BookService bookService;

    @Autowired
    UploadImageService uploadImageService;

    @GetMapping("/book/{idCategory}/{rating}")
    public ResponseEntity<?> getAllBook(@PathVariable long idCategory,@PathVariable int rating){
        return ResponseEntity.ok(bookService.getAll(idCategory,rating));
    }
    @GetMapping("/featuredBook")
    public ResponseEntity<?> getFeaturedBook(){
        return ResponseEntity.ok(bookService.getFeaturedBook());
    }
    @PostMapping("/generatePath")
    public ResponseEntity<?> genPath(
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(uploadImageService.uploadFile(file));
    }
    @PostMapping("/book")
    public ResponseEntity<?> addBook(
            @RequestBody BookRequest bookRequest) {
        return ResponseEntity.ok(bookService.addBook(bookRequest));
    }

    @GetMapping("/book/{id}")
    public ResponseEntity<?> getDetailBook(@PathVariable Long id){
        return ResponseEntity.ok(bookService.getBookDetail(id));
    }
    @DeleteMapping("/book/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id){
        return ResponseEntity.ok(bookService.deleteBook(id));
    }

    @PutMapping("/book/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id,@RequestBody BookRequest bookRequest){
        return ResponseEntity.ok(bookService.updateBook(id,bookRequest));
    }

    @GetMapping("/bookInCategory/{id}/{rating}")
    public ResponseEntity<?> getBookInCategory(@PathVariable Long id,@PathVariable int rating){
        return ResponseEntity.ok(bookService.getBookInCategory(id,rating));
    }

    @GetMapping("/searchBook/{keyword}/{categoryId}/{rating}")
    public ResponseEntity<?> searchBook(@PathVariable String keyword,@PathVariable Long categoryId,@PathVariable int rating){
        return ResponseEntity.ok(bookService.searchBook(keyword,categoryId,rating));
    }
}
