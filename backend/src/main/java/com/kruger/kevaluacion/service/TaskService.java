
package com.kruger.kevaluacion.service;

import com.kruger.kevaluacion.entity.Task;
import com.kruger.kevaluacion.entity.User;
import com.kruger.kevaluacion.mapper.TaskMapper;
import com.kruger.kevaluacion.dto.TaskDtoReq;
import com.kruger.kevaluacion.dto.TaskDtoRes;
import com.kruger.kevaluacion.entity.Project;
import com.kruger.kevaluacion.repository.ProjectRepository;
import com.kruger.kevaluacion.repository.TaskRepository;
import com.kruger.kevaluacion.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskMapper taskMapper;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;

    private Authentication auth;

    public TaskDtoRes createTask(TaskDtoReq taskDto) {

        auth = SecurityContextHolder.getContext().getAuthentication();
        
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        
        Project project = projectRepository.findById(taskDto.getProjectId()).orElseThrow();
        User assignedTo = userRepository.findById(taskDto.getAssignedToId()).orElse(user);
        Task task = taskMapper.toEntity(taskDto);
        
        task.setProject(project);
        task.setAssignedTo(assignedTo);

        return taskMapper.toDto(taskRepository.save(task));

    }

    public List<TaskDtoRes> getTasks() {
        
        auth = SecurityContextHolder.getContext().getAuthentication();

        return taskMapper.toDto(
            taskRepository.findByAssignedToUsername(auth.getName())
        );
        
    }

    public List<TaskDtoRes> getTasksByProject(Long projectId) {

        return taskMapper.toDto(taskRepository.findByProjectId(projectId));

    }

    public TaskDtoRes updateTask(Long id, TaskDtoReq taskDto) {

        auth = SecurityContextHolder.getContext().getAuthentication();
        Task task = taskRepository.findById(id).orElseThrow();
        
        task.setTitle(taskDto.getTitle() != null ? taskDto.getTitle() : task.getTitle());
        task.setDescription(taskDto.getDescription() != null ? taskDto.getDescription() : task.getDescription());
        task.setStatus(taskDto.getStatus() != null ? taskDto.getStatus() : task.getStatus());
        task.setDueDate(taskDto.getDueDate() != null ? taskDto.getDueDate() : task.getDueDate());
        
        if( taskDto.getAssignedToId() != null 
            && taskDto.getAssignedToId() != task.getAssignedTo().getId()) {
            
            task.setAssignedTo(userRepository.findByUsername(auth.getName()).orElseThrow());
        
        }

        if( taskDto.getProjectId() != null 
            && taskDto.getProjectId() != task.getProject().getId()) {
            
            task.setProject(projectRepository.findById(taskDto.getProjectId()).orElseThrow());
        
        }

        return taskMapper.toDto(taskRepository.save(task));

    }

    public TaskDtoRes deleteTask(Long id) {

        Task task = taskRepository.findById(id).orElseThrow();
        taskRepository.delete(task);

        return taskMapper.toDto(task);

    }

}
