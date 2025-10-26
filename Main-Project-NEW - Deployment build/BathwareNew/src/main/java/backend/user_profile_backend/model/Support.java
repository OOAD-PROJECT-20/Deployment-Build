package backend.user_profile_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "support")
public class Support {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticketId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "support_type", length = 50)
    private String supportType;

    @Column(length = 255)
    private String description;

    @Column(length = 500)
    private String remark;

    @Column(length = 100)
    private String status;

    // Getters and Setters
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
