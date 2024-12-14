package com.example.AudioBook.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class WebController {
    @GetMapping("/login")
    public String login(){
        return "Login";
    }
    @GetMapping("/register")
    public String register(){
        return "Register";
    }
    @GetMapping("/admin")
    public String adminHome(){
        return "Admin";
    }
    @GetMapping("/home")
    public String home(){
        return "Home";
    }
    @GetMapping("/addbook")
    public String addbook(){
        return "AddBook";
    }

    @GetMapping("/viewBookDetailAdmin")
    public String viewBookDetail(){
        return "ViewBookDetailAdmin";
    }
    @GetMapping("/deleteBookAdmin")
    public String deleteBook(){
        return "DeleteBookAdmin";
    }

    @GetMapping("/updateBookAdmin")
    public String updateBook(){
        return "UpdateBookAdmin";
    }

    @GetMapping("/updateChapterAdmin")
    public String updateChapter(){
        return "UpdateChapterAdmin";
    }

    @GetMapping("/listenAudioBook")
    public String listenAudioBook(){
        return "ListenAudioBook";
    }
}
