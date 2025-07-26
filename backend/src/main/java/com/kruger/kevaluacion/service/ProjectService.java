
package com.kruger.kevaluacion.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.kruger.kevaluacion.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.kruger.kevaluacion.dto.ProjectDtoReq;
import com.kruger.kevaluacion.dto.ProjectDtoRes;
import com.kruger.kevaluacion.entity.Project;
import com.kruger.kevaluacion.entity.User;
import com.kruger.kevaluacion.mapper.ProjectMapper;
import com.kruger.kevaluacion.repository.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private UserRepository userRepository;

    private Authentication auth;

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public ProjectDtoRes createProject(ProjectDtoReq projectDto) {
        
        auth = SecurityContextHolder.getContext().getAuthentication();
        
        User owner = userRepository.findByUsername(auth.getName()).orElseThrow();
        Project project = projectMapper.toEntity(projectDto);
        project.setOwner(owner);
        project.setCreatedAt(LocalDateTime.now());
        
        return projectMapper.toDto(this.projectRepository.save(project));
    
    }
    
    public List<ProjectDtoRes> getProjectsByOwner() {
        
        auth = SecurityContextHolder.getContext().getAuthentication();
        return projectMapper.toDtoList(projectRepository.findByOwnerUsername(auth.getName()));
        
    }

    public ProjectDtoRes updateProject(Long id, ProjectDtoReq projectDto) {
        
        auth = SecurityContextHolder.getContext().getAuthentication();
        Project project = getProjectById(id).orElseThrow();
        User owner;
        
        if( projectDto.getOwner() != null 
            && projectDto.getOwner() != project.getOwner().getId()) {
            
            owner = userRepository.findByUsername(auth.getName()).orElseThrow();
            project.setOwner(owner);
        
        }

        project.setName(projectDto.getName() != null ? projectDto.getName() : project.getName());
        project.setDescription(projectDto.getDescription() != null ? 
            projectDto.getDescription() : project.getDescription());
        
        return projectMapper.toDto(projectRepository.save(project));
        
    }

    public ProjectDtoRes deleteProject(Long id) {
        
        auth = SecurityContextHolder.getContext().getAuthentication();
        Project project = getProjectById(id).orElseThrow();
        
        projectRepository.delete(project);

        return projectMapper.toDto(project);

    }

}
