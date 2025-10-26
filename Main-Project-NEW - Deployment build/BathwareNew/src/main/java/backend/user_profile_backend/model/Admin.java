package backend.user_profile_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admin") // ensure case matches your DB table
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "adminId")
    private Long adminId;

    @OneToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Column(name = "adminLevel")
    private Integer adminLevel;

    public Admin() {}

    public Admin(User user, Integer adminLevel) {
        this.user = user;
        this.adminLevel = adminLevel;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getAdminLevel() {
        return adminLevel;
    }

    public void setAdminLevel(Integer adminLevel) {
        this.adminLevel = adminLevel;
    }
}
