package com.example.AudioBook.DTO.Audio;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AudioRequest {
    @JsonProperty("audio_name")
    private String audio_name;
    @JsonProperty("audio_file")
    private String audio_file;
    @JsonProperty("chapter_id")
    private Long chapter_id;
}
