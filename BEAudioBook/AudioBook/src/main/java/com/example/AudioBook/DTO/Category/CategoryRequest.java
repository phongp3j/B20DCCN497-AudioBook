package com.example.AudioBook.DTO.Category;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRequest {
    @JsonProperty("name")
    private String name;
}
