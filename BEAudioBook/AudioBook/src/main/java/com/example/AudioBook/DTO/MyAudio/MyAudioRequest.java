package com.example.AudioBook.DTO.MyAudio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MyAudioRequest {
    @JsonProperty("audio_name")
    private String audio_name;
    @JsonProperty("audio_url")
    private String audio_url;
    @JsonProperty("username")
    private String username;
}
