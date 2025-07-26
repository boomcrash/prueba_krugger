
package com.kruger.kevaluacion.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import com.kruger.kevaluacion.security.JwtAuthenticationFilter;
import com.kruger.kevaluacion.security.UserDetailsServiceM;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceM userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        HandlerMappingIntrospector introspector) throws Exception {
        
        return http
            .cors(cors -> cors.configure(http))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(req -> req
                .requestMatchers(
                    "/auth/**",
                    "/actuator",
                    "/actuator/**",
                    "/swagger",
                    "/swagger/**",
                    "/swagger-ui/index.html", 
                    "/swagger-ui/**", 
                    "/v3/api-docs/**").permitAll()
                .requestMatchers(
                    HttpMethod.POST, 
                    "/users").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(
                jwtAuthFilter, 
                UsernamePasswordAuthenticationFilter.class)
            .build();
    
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        
        DaoAuthenticationProvider dap = new DaoAuthenticationProvider(userDetailsService);

        dap.setPasswordEncoder(passwordEncoder());
        
        return dap;
        
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
    
        return new BCryptPasswordEncoder();
    
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config) throws Exception {
        
        return config.getAuthenticationManager();
    
    }

}
