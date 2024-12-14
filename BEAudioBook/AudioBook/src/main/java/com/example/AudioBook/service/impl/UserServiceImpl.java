package com.example.AudioBook.service.impl;

import com.example.AudioBook.DTO.User.*;
import com.example.AudioBook.entity.User;
import com.example.AudioBook.repository.RoleRepository;
import com.example.AudioBook.repository.UserRepository;
import com.example.AudioBook.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Override
    public User register(UserDTO userDTO) {
        User user = new User();
        if(userRepository.existsByUsername(userDTO.getUsername())){
            return null;
        }
        else{
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
            user.setUsername(userDTO.getUsername());
            user.setFullname(userDTO.getFullname());
            user.setPhonenumber(userDTO.getPhonenumber());
            user.setEmail(userDTO.getEmail());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setRole(roleRepository.findById(Long.valueOf(2)).get());
        }
        return userRepository.save(user);
    }

    @Override
    public String login(UserLoginRequest userLoginRequest) {
        Optional<User> list = userRepository.findByUsername(userLoginRequest.getUsername());
        User user = new User();
        if(list.isEmpty()){
            return null;
        }
        user = list.get();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
        if(passwordEncoder.matches(userLoginRequest.getPassword(),user.getPassword())){
            return user.getRole().getName();
        }
        return null;
    }

    @Override
    public List<UserResponse> getALl() {
        List<UserResponse> res = new ArrayList<>();
        List<User> tmp = userRepository.findAll();
        for(User i : tmp){
            UserResponse x = new UserResponse();
            x.setUsername(i.getUsername());
            x.setEmail(i.getEmail());
            x.setFullname(i.getFullname());
            x.setPhonenumber(i.getPhonenumber());
            x.setRole(i.getRole().getName());
            res.add(x);
        }
        return res;
    }

    @Override
    public UserResponse getUser(String username) {
        User user = userRepository.findByUsername(username).get();
        UserResponse x = new UserResponse();
        x.setUsername(user.getUsername());
        x.setEmail(user.getEmail());
        x.setFullname(user.getFullname());
        x.setPhonenumber(user.getPhonenumber());
        x.setRole(user.getRole().getName());
        return x;
    }

    @Override
    public String deleteUser(String username) {
        User user = userRepository.findByUsername(username).get();
        userRepository.delete(user);
        return "Delete success!";
    }

    @Override
    public String updateUser(String username, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findByUsername(username).get();
        user.setFullname(userUpdateRequest.getFullname());
        user.setPhonenumber(userUpdateRequest.getPhonenumber());
        user.setEmail(userUpdateRequest.getEmail());
        user.setRole(roleRepository.findById(userUpdateRequest.getRoleId()).get());
        userRepository.save(user);
        return "Update success!";
    }

    @Override
    public String changeProfile(String username, ChangeProfileRequest changeProfileRequest) {
        User user = userRepository.findByUsername(username).get();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
        if(passwordEncoder.matches(changeProfileRequest.getOldPassword(),user.getPassword())){
            user.setFullname(changeProfileRequest.getFullname());
            user.setPhonenumber(changeProfileRequest.getPhonenumber());
            user.setEmail(changeProfileRequest.getEmail());
            user.setPassword(passwordEncoder.encode(changeProfileRequest.getNewPassword()));
            userRepository.save(user);
            return "Change profile success!";
        }
        return "Change profile fail!";
    }


}
