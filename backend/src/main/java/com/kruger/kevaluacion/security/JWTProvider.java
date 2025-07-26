
package com.kruger.kevaluacion.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JWTProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationMs;

    private Key key;
    
    @PostConstruct
    public void init() {
    
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    
    }

    public String generateToken(Authentication authentication) {
    
        String username = authentication.getName();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
            .claim(
                "roles", 
                authentication.getAuthorities().stream()
                .map(a -> a.getAuthority() ).toList()
            )
            .setSubject(username)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
        
    }
    
    public boolean isTokenValid(
        String token, UserDetails userDetails) throws ExpiredJwtException {
    
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    
    }

    public String extractUsername(String token) {
    
        return extractClaims(token).getSubject();
    
    }

    public boolean isTokenExpired(String token) {
    
        Date expiration = extractClaims(token).getExpiration();
        return expiration.before(new Date());
    
    }

    private Claims extractClaims(String token) {
    
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    
    }

    public long getExpirationMillis() {
    
        return expirationMs;
    
    }

}
