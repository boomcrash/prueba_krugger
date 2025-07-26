package com.kruger.kevaluacion.mapper;

import com.kruger.kevaluacion.entity.User;
import com.kruger.kevaluacion.dto.UserDtoReq;
import com.kruger.kevaluacion.dto.UserDtoRes;

import java.util.List;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDtoRes toDto(User user);
    
    User toEntity(UserDtoReq userDto);

    List<UserDtoRes> toDto(List<User> usersDto);
    
}
