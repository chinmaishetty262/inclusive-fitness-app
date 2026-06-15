package com.authservice.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.authservice.auth.config.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import javax.annotation.PostConstruct;


import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    private static final Logger logger =
        LoggerFactory.getLogger(JwtFilter.class);

    @Autowired(required = false)
    private MeterRegistry meterRegistry;

    private Counter jwtFailureCounter;

    @PostConstruct
    public void init() {

    if (meterRegistry != null) {
        jwtFailureCounter =
                Counter.builder("auth.jwt.invalid")
                        .description("Invalid JWT tokens")
                        .register(meterRegistry);
    }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

         String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

             try {
            String username = jwtUtil.extractUsername(token);

            
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (JwtException e) {
            logger.warn("JWT validation failed: {}", e.getMessage());

             logger.warn("Unauthorized request received");
            if (jwtFailureCounter != null) {
                jwtFailureCounter.increment();
            }
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"Invalid token\"}");
            return;
        }
        }

        filterChain.doFilter(request, response);
    }
}