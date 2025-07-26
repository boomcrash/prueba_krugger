
package com.kruger.kevaluacion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kruger.kevaluacion.dto.ProjectDtoReq;
import com.kruger.kevaluacion.dto.ProjectDtoRes;
import com.kruger.kevaluacion.service.ProjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public List<ProjectDtoRes> getProjects() {
        
        return projectService.getProjectsByOwner();

    }
    
    @PostMapping
    public ProjectDtoRes createProject(@RequestBody @Valid ProjectDtoReq projectDto) {
        
        return projectService.createProject(projectDto);

    }
    
    @PutMapping("/{id}")
    public ProjectDtoRes updateProject(
        @PathVariable Long id, @RequestBody ProjectDtoReq projectDto) {
        
        return projectService.updateProject(id, projectDto);
        
    }

    @DeleteMapping("/{id}")
    public ProjectDtoRes deleteProject(@PathVariable Long id) {
        
        return projectService.deleteProject(id);
        
    }

}
