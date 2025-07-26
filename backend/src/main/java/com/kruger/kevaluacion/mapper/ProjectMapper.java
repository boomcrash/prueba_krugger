
package com.kruger.kevaluacion.mapper;

import com.kruger.kevaluacion.entity.Project;
import com.kruger.kevaluacion.dto.ProjectDtoReq;
import com.kruger.kevaluacion.dto.ProjectDtoRes;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    ProjectDtoRes toDto(Project project);

    @Mapping(target = "owner", ignore = true)
    Project toEntity(ProjectDtoReq projectDto);
    
    List<ProjectDtoRes> toDtoList(List<Project> projectDto);
    
}
