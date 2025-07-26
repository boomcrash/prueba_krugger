
package com.kruger.kevaluacion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.kruger.kevaluacion.dto.LoginDtoReq;
import com.kruger.kevaluacion.dto.LoginDtoRes;
import com.kruger.kevaluacion.security.JWTProvider;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JWTProvider jwtProvider;

    @Autowired
    private PasswordEncoder encoder;
    
    @PostMapping("/login")
    public LoginDtoRes login(@RequestBody @Valid LoginDtoReq loginRequest) {
    
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), 
                loginRequest.getPassword()
            );
        

        return new LoginDtoRes(
            jwtProvider.generateToken(authManager.authenticate(authToken))
        );
    
    }

}
