
package com.kruger.kevaluacion.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskDtoRes {
    
    private Long id;
    
    private String title;
    
    private String description;
    
    private String status;
    
    private Long assignedToId;
    
    private Long projectId;
    
    private String dueDate;
    
    private String createdAt;

}
