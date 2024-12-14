package com.example.AudioBook.DTO.Audio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AudioDetailResponse {
    @JsonProperty("id")
    private Long id;
    @JsonProperty("audio_name")
    private String audio_name;
    @JsonProperty("audio_file")
    private String audio_file;
}
