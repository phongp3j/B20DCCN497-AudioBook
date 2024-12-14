package com.example.AudioBook.DTO.User;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {
    @JsonProperty("username")
    private String username;
    @JsonProperty("password")
    private String password;
}
