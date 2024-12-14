package com.example.AudioBook.DTO.ListenHistory;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ListenHistoryResponse {
    @JsonProperty("titleOfBook")
    private String titleOfBook;
    @JsonProperty("titleOfChapter")
    private String titleOfChapter;
    @JsonProperty("audioUrl")
    private String audioUrl;
    @JsonProperty("nameOfAudio")
    private String nameOfAudio;
    @JsonProperty("time")
    private String time;
    @JsonProperty("username")
    private String username;
}
