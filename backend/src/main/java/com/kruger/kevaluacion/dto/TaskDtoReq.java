package com.kruger.kevaluacion.dto;

import java.time.LocalDate;

import com.kruger.kevaluacion.entity.Task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@RequiredArgsConstructor
public class TaskDtoReq {
    
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 100, message = "El título debe tener máximo 100 caracteres")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 255, message = "La descripción debe tener máximo 255 caracteres")
    private String description;

    @NotNull(message = "El estado es obligatorio")
    private Task.Status status;

    @NotNull(message = "El ID del asignado es obligatorio")
    private Long assignedToId;

    @NotNull(message = "El ID del proyecto es obligatorio")
    private Long projectId;
    
    private LocalDate dueDate;
}
