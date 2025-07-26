package com.kruger.kevaluacion.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.kruger.kevaluacion.dto.TaskDtoReq;
import com.kruger.kevaluacion.dto.TaskDtoRes;
import com.kruger.kevaluacion.service.TaskService;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @PostMapping
    public TaskDtoRes createTask(@RequestBody @Valid TaskDtoReq taskDto) {
        
        return taskService.createTask(taskDto);

    }

    @GetMapping
    public List<TaskDtoRes> getTasks() {
        
        return taskService.getTasks();
    
    }

    @GetMapping("/project/{projectId}")
    public List<TaskDtoRes> getTasksByProject(@PathVariable Long projectId) {
        
        return taskService.getTasksByProject(projectId);
    
    }

    @PutMapping("/{id}")
    public TaskDtoRes updateTask(@PathVariable Long id, @RequestBody TaskDtoReq taskDto) {
        
        return taskService.updateTask(id, taskDto);

    }

    @DeleteMapping("/{id}")
    public TaskDtoRes deleteTask(@PathVariable Long id) {
        
        return taskService.deleteTask(id);
    
    }

}
