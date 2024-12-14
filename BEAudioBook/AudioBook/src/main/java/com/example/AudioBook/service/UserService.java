package com.example.AudioBook.service;

import com.example.AudioBook.DTO.User.*;
import com.example.AudioBook.entity.User;

import java.util.List;

public interface UserService {
    User register(UserDTO userDTO);
    String login(UserLoginRequest userLoginRequest);
    List<UserResponse> getALl();
    UserResponse getUser(String username);
    String deleteUser(String username);
    String updateUser(String username, UserUpdateRequest userUpdateRequest);
    String changeProfile(String username, ChangeProfileRequest changeProfileRequest);
}
