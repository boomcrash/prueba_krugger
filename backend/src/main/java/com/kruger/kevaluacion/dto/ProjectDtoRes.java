
package com.kruger.kevaluacion.dto;

import java.time.LocalDateTime;

import com.kruger.kevaluacion.entity.User;

import lombok.*;

@Data
public class ProjectDtoRes {
    
    private Long id;
    
    private String name;
    
    private String description;
    
    private LocalDateTime createdAt;
    
    private User owner;

}
