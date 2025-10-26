package backend.user_profile_backend.dto;

import java.util.Set;

public class UserResponse {
    private Integer id; // change from long → Integer
    private String username;
    private String email;
    private String telephone;
    private Set<String> roles;
    private String authority;

    public UserResponse() {}

    public UserResponse(Integer id, String username, String email, String telephone, Set<String> roles, String authority) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.telephone = telephone;
        this.roles = roles;
        this.authority = authority;
    }

    // getters/setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public String getAuthority() { return authority; }
    public void setAuthority(String authority) { this.authority = authority; }
}
