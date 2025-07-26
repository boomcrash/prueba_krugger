package com.kruger.kevaluacion.dto;

import com.kruger.kevaluacion.entity.User;
import lombok.Data;

@Data
public class UserDtoRes {

    private Long id;

    private String username;

    private String email;

    private User.Role role;

}
