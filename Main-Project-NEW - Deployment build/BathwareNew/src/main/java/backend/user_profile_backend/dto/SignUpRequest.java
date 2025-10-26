package backend.user_profile_backend.dto;

public class SignUpRequest {
    private String username;
    private String email;
    private String password;
    private String telephone;

    public SignUpRequest() {}
    public SignUpRequest(String username, String email, String password, String telephone) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.telephone = telephone;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone= telephone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

