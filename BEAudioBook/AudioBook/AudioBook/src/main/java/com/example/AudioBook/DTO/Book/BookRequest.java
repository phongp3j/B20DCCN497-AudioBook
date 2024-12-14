package com.example.AudioBook.DTO.Book;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BookRequest {
    @JsonProperty("title")
    private String title;
    @JsonProperty("author")
    private String author;
    @JsonProperty("categoryId")
    private Long categoryId;
    @JsonProperty("description")
    private String description;
    @JsonProperty("published")
    private String published;
    @JsonProperty("image")
    private String image;
}
