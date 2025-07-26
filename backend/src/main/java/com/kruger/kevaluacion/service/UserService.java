package com.kruger.kevaluacion.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kruger.kevaluacion.dto.UserDtoReq;
import com.kruger.kevaluacion.dto.UserDtoRes;
import com.kruger.kevaluacion.entity.User;
import com.kruger.kevaluacion.mapper.UserMapper;
import com.kruger.kevaluacion.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    public UserDtoRes createUser(UserDtoReq usereq) {
   
        User user = userMapper.toEntity(usereq);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userMapper.toDto(userRepository.save(user));
   
    }

    public List<UserDtoRes> getAllUsers() {
        
        return userMapper.toDto( userRepository.findAll() );
    
    }

    public UserDtoRes getUserById(Long id) {
        
        return userMapper.toDto(userRepository.findById(id).orElseThrow());

    }

    public UserDtoRes registerUser(UserDtoReq userDto) {
        
        User user = userMapper.toEntity(userDto);
        
        return userMapper.toDto(userRepository.save(user));
        
    }

}
