package com.example.AudioBook.DTO.Chapter;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChapterRequest {
    @JsonProperty("chapter_title")
    private String chapter_title;
    @JsonProperty("text")
    private String text;
    @JsonProperty("book_id")
    private Long book_id;
}
