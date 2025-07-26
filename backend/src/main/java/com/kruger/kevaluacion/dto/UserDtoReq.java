package com.kruger.kevaluacion.dto;

import com.kruger.kevaluacion.entity.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDtoReq {

    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El correo electrónico debe ser válido")
    private String email;

    @NotNull(message = "El rol es obligatorio")
    private User.Role role;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

}
