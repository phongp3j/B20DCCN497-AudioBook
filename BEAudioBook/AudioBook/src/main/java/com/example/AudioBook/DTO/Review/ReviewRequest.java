package com.example.AudioBook.DTO.Review;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
    @JsonProperty("review")
    private String review;
    @JsonProperty("rating")
    private int rating;
    @JsonProperty("book_id")
    private Long book_id;
    @JsonProperty("username")
    private String username;
}
