package backend.user_profile_backend.dto;

public class LoginResponse {
    private String role, message;
    private Long userId;

    public LoginResponse() {}
    
    public LoginResponse(String role, String message) {
        this.role = role;
        this.message = message;
    }
    
    public LoginResponse(String role, String message, Long userId) {
        this.role = role;
        this.message = message;
        this.userId = userId;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
