package backend.user_profile_backend.dto;

public class CombinedUserResponse {
    private Long userId;
    private String username;
    private String email;
    private String telephone;
    private String authority;
    private Long customerId;
    private Long adminId;

    public CombinedUserResponse() {}

    public CombinedUserResponse(Long userId, String username, String email,
                                String telephone, String authority,
                                Long customerId, Long adminId) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.telephone = telephone;
        this.authority = authority;
        this.customerId = customerId;
        this.adminId = adminId;
    }

    // getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getAuthority() { return authority; }
    public void setAuthority(String authority) { this.authority = authority; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }
}
