package com.finance.tracker.service;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.finance.tracker.dto.AuthResponse;
import com.finance.tracker.dto.LoginRequest;
import com.finance.tracker.dto.RegisterRequest;
import com.finance.tracker.entity.Role;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.security.JwtService;

import java.util.Optional;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private UserRepository repository;
    private PasswordEncoder encoder;
    private JwtService jwtService;
    private ModelMapper modelMapper;

    public AuthService(UserRepository repository, PasswordEncoder encoder, JwtService jwtService,
            ModelMapper modelMapper) {
        this.repository = repository;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.modelMapper = modelMapper;
    }

    public void register(RegisterRequest request) {

        if (repository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("Email already exists");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = new User();

        modelMapper.map(request, user);

        user.setPassword(
                encoder.encode(request.getPassword()));

        user.setRole(Role.USER);

        repository.save(user);

    }

    public AuthResponse login(LoginRequest request) {
        log.debug("Login request received for email: {}");

        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }

        User user = repository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    // Helper used by JwtAuthenticationFilter to load a User by email
    public User loadUserByUsername(String email) {
        if (email == null) {
            return null;
        }

        return repository.findByEmail(email.trim()).orElse(null);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        log.error("Runtime exception occurred: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(ex.getMessage());
    }

}
