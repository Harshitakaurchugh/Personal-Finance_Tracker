package com.finance.tracker.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.finance.tracker.entity.User;
import com.finance.tracker.security.JwtService;
import com.finance.tracker.service.AuthService;
import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final AuthService userservice; // if required args constructor is used, this will be injected
                                           // automatically(constructor injection)

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            String email = jwtService.extractSubject(token);
            logger.debug("JwtAuthenticationFilter extracted subject from token: {}", email);

            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) { 

                User user = userservice.loadUserByUsername(email);
                logger.debug("JwtAuthenticationFilter loaded user for email={}: {}", email,
                        user != null ? user.getId() : null);

                if (jwtService.isTokenValid(token, user)) {
                    logger.debug("JwtAuthenticationFilter token is valid for user id={}", user.getId());

                    GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            java.util.List.of(authority));

                    SecurityContextHolder   
                            .getContext()
                            .setAuthentication(authentication);
                } else {
                    logger.warn("JwtAuthenticationFilter token invalid for email={}", email);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            logger.error("JwtAuthenticationFilter invalid JWT", e);
        }

        filterChain.doFilter(request, response);
    }
}