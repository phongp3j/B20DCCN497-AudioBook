package com.example.AudioBook.service.impl;

import com.example.AudioBook.DTO.Audio.AudioDetailResponse;
import com.example.AudioBook.DTO.Book.BookDetailResponse;
import com.example.AudioBook.DTO.Book.BookRequest;
import com.example.AudioBook.DTO.Book.BookResponse;
import com.example.AudioBook.DTO.Chapter.ChapterDetailResponse;
import com.example.AudioBook.entity.Audio;
import com.example.AudioBook.entity.Book;
import com.example.AudioBook.entity.Chapter;
import com.example.AudioBook.repository.AudioRepository;
import com.example.AudioBook.repository.BookRepository;
import com.example.AudioBook.repository.CategoryRepository;
import com.example.AudioBook.repository.ChapterRepository;
import com.example.AudioBook.service.BookService;
import com.example.AudioBook.service.UploadImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Repository
public class BookServiceImpl implements BookService {
    @Autowired
    BookRepository bookRepository;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    ChapterRepository chapterRepository;
    @Autowired
    AudioRepository audioRepository;
    @Override
    public Long addBook(BookRequest bookRequest) {
        Book book = new Book();
        book.setTitle(bookRequest.getTitle());
        book.setImage(bookRequest.getImage());
        book.setAuthor(bookRequest.getAuthor());
        book.setCategory(categoryRepository.findById(bookRequest.getCategoryId()).get());
        book.setDescription(bookRequest.getDescription());
        book.setPublished_at(bookRequest.getPublished());
        bookRepository.save(book);
        return book.getId();
    }

    @Transactional
    @Override
    public List<BookResponse> getAll() {
        List<BookResponse> res = new ArrayList<>();
        List<Book> tmp = bookRepository.findAll();
        for(Book b : tmp){
            BookResponse x = new BookResponse();
            x.setId(b.getId());
            x.setImage(b.getImage());
            x.setDescription(b.getDescription());
            x.setCategory(b.getCategory().getCategory_name());
            x.setAuthor(b.getAuthor());
            x.setPublished(b.getPublished_at());
            x.setTitle(b.getTitle());
            res.add(x);
        }
        return res;
    }

    @Override
    public BookDetailResponse getBookDetail(Long id) {
        BookDetailResponse res = new BookDetailResponse();
        Book book = bookRepository.findById(id).get();
        res.setId(id);
        res.setAuthor(book.getAuthor());
        res.setImage(book.getImage());
        res.setDescription(book.getDescription());
        res.setCategory(book.getCategory().getCategory_name());
        res.setTitle(book.getTitle());
        res.setPublished(book.getPublished_at());
        List<ChapterDetailResponse> listChapter = new ArrayList<>();
        List<Chapter> listChapter1 = chapterRepository.findByBookId(id);
        for(Chapter i : listChapter1){
            ChapterDetailResponse tmp = new ChapterDetailResponse();
            tmp.setId(i.getId());
            tmp.setText(i.getText());
            tmp.setTitle_chapter(i.getTitle_chapter());
            List<AudioDetailResponse> listAudio = new ArrayList<>();
            List<Audio> listAudio1 = audioRepository.findByChapterId(i.getId());
            for(Audio j : listAudio1){
                AudioDetailResponse tmp1 = new AudioDetailResponse();
                tmp1.setId(j.getId());
                tmp1.setAudio_name(j.getAudio_name());
                tmp1.setAudio_file(j.getAudio_file());
                listAudio.add(tmp1);
            }
            tmp.setAudioes(listAudio);
            listChapter.add(tmp);
        }
        res.setChapters(listChapter);
        return res;
    }
    @Transactional
    @Override
    public String deleteBook(Long id) {
        List<Chapter> chapters = chapterRepository.findByBookId(id);
        for(Chapter i : chapters){
            audioRepository.deleteByChapterId(i.getId());
        }
        chapterRepository.deleteAll(chapters);
        bookRepository.deleteById(id);
        return "Success!";
    }

    @Override
    public String updateBook(Long id, BookRequest bookRequest) {
        Book book = bookRepository.findById(id).get();
        book.setTitle(bookRequest.getTitle());
        book.setImage(bookRequest.getImage());
        book.setAuthor(bookRequest.getAuthor());
        book.setCategory(categoryRepository.findById(bookRequest.getCategoryId()).get());
        book.setDescription(bookRequest.getDescription());
        book.setPublished_at(bookRequest.getPublished());
        bookRepository.save(book);
        return "Success!";
    }
}
