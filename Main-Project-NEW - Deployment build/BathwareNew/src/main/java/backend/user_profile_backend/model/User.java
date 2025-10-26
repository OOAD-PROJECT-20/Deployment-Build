package backend.user_profile_backend.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    private Long userId;

    @Column(name = "userName", nullable = false, unique = true)
    private String userName;

    @Column(name = "userPassword", nullable = false)
    private String userPassword;

    @Column(name = "telephone", unique = true)
    private String telephone;

    @Column(name = "authority", nullable = false)
    private String authority;

    @Column(name = "email", unique = true)
    private String email;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;


    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String username) { this.userName = username; }

    public String getPassword() { return userPassword; }
    public void setPassword(String password) { this.userPassword = password; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getAuthority() { return authority; }
    public void setAuthority(String authority) { this.authority = authority; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
}
