package com.example.AudioBook.DTO.Chapter;

import com.example.AudioBook.DTO.Audio.AudioDetailResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChapterDetailResponse {
    @JsonProperty("id")
    private Long id;
    @JsonProperty("title_chapter")
    private String title_chapter;
    @JsonProperty("text")
    private String text;
    @JsonProperty("listAudio")
    private List<AudioDetailResponse> audioes;
}
