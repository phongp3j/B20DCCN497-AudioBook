package com.example.AudioBook.DTO.Book;

import com.example.AudioBook.DTO.Chapter.ChapterDetailResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.util.List;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BookDetailResponse {
    @JsonProperty("id")
    private Long id;
    @JsonProperty("title")
    private String title;
    @JsonProperty("author")
    private String author;
    @JsonProperty("category")
    private String category;
    @JsonProperty("description")
    private String description;
    @JsonProperty("published")
    private String published;
    @JsonProperty("image")
    private String image;
    @JsonProperty("listChapter")
    private List<ChapterDetailResponse> chapters;
}
