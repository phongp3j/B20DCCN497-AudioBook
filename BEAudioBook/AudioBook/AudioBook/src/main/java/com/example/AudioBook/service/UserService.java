package com.example.AudioBook.service;

import com.example.AudioBook.DTO.User.UserDTO;
import com.example.AudioBook.DTO.User.UserLoginDTO;
import com.example.AudioBook.DTO.User.UserResponseDTO;
import com.example.AudioBook.DTO.User.UserUpdateRequest;
import com.example.AudioBook.entity.User;

import java.util.List;

public interface UserService {
    User register(UserDTO userDTO);
    String login(UserLoginDTO userLoginDTO);
    List<UserResponseDTO> getALl();

    String deleteUser(String username);
    String updateUser(String username, UserUpdateRequest userUpdateRequest);
}
