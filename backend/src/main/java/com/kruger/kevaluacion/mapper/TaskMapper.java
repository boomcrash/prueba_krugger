package com.kruger.kevaluacion.mapper;

import com.kruger.kevaluacion.entity.Task;
import com.kruger.kevaluacion.dto.TaskDtoReq;
import com.kruger.kevaluacion.dto.TaskDtoRes;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    TaskDtoRes toDto(Task task);

    Task toEntity(TaskDtoReq taskDto);

    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    List<TaskDtoRes> toDto(List<Task> taskDto);

}
