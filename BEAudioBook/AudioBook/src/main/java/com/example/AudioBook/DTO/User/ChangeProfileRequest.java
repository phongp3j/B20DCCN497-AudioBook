package com.example.AudioBook.DTO.User;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChangeProfileRequest {
    @JsonProperty("username")
    private String username;
    @JsonProperty("fullname")
    private String fullname;
    @JsonProperty("phonenumber")
    private String phonenumber;
    @JsonProperty("email")
    private String email;
    @JsonProperty("oldPassword")
    private String oldPassword;
    @JsonProperty("newPassword")
    private String newPassword;
}
