package com.kruger.kevaluacion.controller;

import com.kruger.kevaluacion.dto.UserDtoReq;
import com.kruger.kevaluacion.dto.UserDtoRes;
import com.kruger.kevaluacion.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public UserDtoRes createUser(@RequestBody @Valid UserDtoReq userDto) {
        
        return userService.createUser(userDto);
    
    }
    
    @GetMapping
    public List<UserDtoRes> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDtoRes getUser(@PathVariable Long id) {
    
        return userService.getUserById(id);
    
    }

}
