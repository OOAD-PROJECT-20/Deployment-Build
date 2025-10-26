package backend.user_profile_backend.dto;

public class SupportDTO {
    private Long ticketId;
    private Long userId;
    private Long productId;
    private Long orderId;
    private String supportType;
    private String description;
    private String remark;
    private String status;

    // Getters & Setters
    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getSupportType() { return supportType; }
    public void setSupportType(String supportType) { this.supportType = supportType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
