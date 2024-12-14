package com.example.AudioBook.service.impl;

import com.example.AudioBook.DTO.Category.CategoryRequest;
import com.example.AudioBook.DTO.Category.CategoryResponseDTO;
import com.example.AudioBook.entity.Audio;
import com.example.AudioBook.entity.Book;
import com.example.AudioBook.entity.Category;
import com.example.AudioBook.entity.Chapter;
import com.example.AudioBook.repository.AudioRepository;
import com.example.AudioBook.repository.BookRepository;
import com.example.AudioBook.repository.CategoryRepository;
import com.example.AudioBook.repository.ChapterRepository;
import com.example.AudioBook.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Repository
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired
    private AudioRepository audioRepository;
    @Override
    public List<CategoryResponseDTO> getAll() {
        List<CategoryResponseDTO> res = new ArrayList<>();
        List<Category> tmp = categoryRepository.findAll();
        List<Book> listbook = bookRepository.findAll();
        for(int i = 0 ; i < tmp.size() ; i++){
            Category x = tmp.get(i);
            CategoryResponseDTO y = new CategoryResponseDTO();
            y.setId(x.getId());
            y.setName(x.getCategory_name());
            long b = 0;
            for(Book j : listbook){
                if(j.getCategory().getCategory_name().equals(x.getCategory_name())){
                    b++;
                }
            }
            y.setBooks(b);
            res.add(y);
        }
        return res;
    }

    @Override
    public String addCategory(CategoryRequest categoryRequest) {
        Category x = new Category();
        x.setCategory_name(categoryRequest.getName());
        List<Category> list = categoryRepository.findAll();
        for(Category i : list){
            if(i.getCategory_name().toLowerCase().equals(categoryRequest.getName().toLowerCase())){
                return "Failed!";
            }
        }
        categoryRepository.save(x);
        return "Success!";
    }

    @Override
    public String updateCategory(Long id, CategoryRequest categoryRequest) {
        Category category = categoryRepository.findById(id).get();
        List<Category> list = categoryRepository.findAll();
        for(Category i : list){
            if(i.getCategory_name().toLowerCase().equals(categoryRequest.getName().toLowerCase())){
                return "Failed!";
            }
        }
        category.setCategory_name(categoryRequest.getName());
        categoryRepository.save(category);
        return "Success!";
    }
    @Transactional
    @Override
    public String deleteCategory(Long id) {
        // Lấy danh sách các sách thuộc danh mục muốn xóa
        List<Book> books = bookRepository.findByCategoryId(id);
        for (Book book : books) {
            // Lấy danh sách các chương liên quan đến sách
            List<Chapter> chapters = chapterRepository.findByBookId(book.getId());
            for (Chapter chapter : chapters) {
                // Xóa tất cả các audio liên quan đến chương
                audioRepository.deleteByChapterId(chapter.getId());
            }
            // Xóa các chương
            chapterRepository.deleteAll(chapters);
        }
        // Xóa các sách
        bookRepository.deleteAll(books);
        // Xóa danh mục
        categoryRepository.deleteById(id);
        return "Success!";
    }

}
