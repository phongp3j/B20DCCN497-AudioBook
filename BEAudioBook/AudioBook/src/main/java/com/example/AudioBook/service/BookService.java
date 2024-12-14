package com.example.AudioBook.service;

import com.example.AudioBook.DTO.Book.BookDetailResponse;
import com.example.AudioBook.DTO.Book.BookRequest;
import com.example.AudioBook.DTO.Book.BookResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BookService {
    Long addBook(BookRequest bookRequest) ;
    List<BookResponse> getAll(Long idCategory, int rating);
    BookDetailResponse getBookDetail(Long id);
    String deleteBook(Long id);
    String updateBook(Long id,BookRequest bookRequest);
    List<BookResponse> getBookInCategory(Long id, int rating);
    List<BookResponse> searchBook(String keyword, Long idCategory, int rating);
    List<BookResponse> getFeaturedBook();
}
