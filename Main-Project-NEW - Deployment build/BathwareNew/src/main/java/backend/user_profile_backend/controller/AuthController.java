package backend.user_profile_backend.controller;

import backend.user_profile_backend.dto.LoginRequest;
import backend.user_profile_backend.dto.LoginResponse;
import backend.user_profile_backend.dto.SignUpRequest;
import backend.user_profile_backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Login endpoint
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.authenticate(request.getUsername(), request.getPassword())
                .map(user -> new LoginResponse(user.getAuthority(), "Login successful", user.getUserId()))
                .orElse(new LoginResponse(null, "Invalid username, email, or telephone or password", null));
    }

    // Sign-up endpoint
    @PostMapping("/signup")
    public Map<String, Object> signUp(@RequestBody SignUpRequest request) {
        return authService.signUp(request);
    }
}
