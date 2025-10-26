package backend.user_profile_backend.dto;

public class CreateSupportRequest {
    private Long userId;
    private Long productId;
    private Long orderId;
    private String supportType;
    private String description;

    // Getters & Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getSupportType() { return supportType; }
    public void setSupportType(String supportType) { this.supportType = supportType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
