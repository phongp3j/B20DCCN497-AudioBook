package com.example.AudioBook.DTO.User;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    @JsonProperty("username")
    private String username;
    @JsonProperty("password")
    private String password;
    @JsonProperty("fullname")
    private String fullname;
    @JsonProperty("phonenumber")
    private String phonenumber;
    @JsonProperty("email")
    private String email;
}
