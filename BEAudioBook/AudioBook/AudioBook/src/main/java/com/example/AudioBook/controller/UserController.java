package com.example.AudioBook.controller;

import com.example.AudioBook.DTO.User.UserDTO;
import com.example.AudioBook.DTO.User.UserLoginDTO;
import com.example.AudioBook.DTO.User.UserResponseDTO;
import com.example.AudioBook.DTO.User.UserUpdateRequest;
import com.example.AudioBook.entity.User;
import com.example.AudioBook.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/user/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO){
        User user = userService.register(userDTO);
        if(user == null){
            return ResponseEntity.badRequest().body("Username đã được sử dụng!");
        }
        return ResponseEntity.ok("Đăng ký thành công");
    }

    @PostMapping("/user/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDTO userLoginDTO){
        String statusLogin = userService.login(userLoginDTO);
        if(statusLogin == null){
            return ResponseEntity.badRequest().body("Tài khoản hoặc mật khẩu không đúng!");
        }
        return ResponseEntity.ok(statusLogin+"");
    }

    @GetMapping("/user/get-user")
    public ResponseEntity<?> getAll(){
        List<UserResponseDTO> list = userService.getALl();
        return ResponseEntity.ok(list);
    }
    @PutMapping("/user/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @RequestBody UserUpdateRequest userUpdateRequest){
        return ResponseEntity.ok(userService.updateUser(username,userUpdateRequest));
    }
    @DeleteMapping("/user/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username){
        return ResponseEntity.ok(userService.deleteUser(username));
    }
}
