package com.example.AudioBook.DTO.Review;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewStat {
    @JsonProperty("5s")
    private float s5;
    @JsonProperty("4s")
    private float s4;
    @JsonProperty("3s")
    private float s3;
    @JsonProperty("2s")
    private float s2;
    @JsonProperty("1s")
    private float s1;
}
