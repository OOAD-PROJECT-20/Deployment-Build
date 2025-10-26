package backend.user_profile_backend.dto;

public class QuotationRequestDto {
    private Long userId;
    private String qname;
    private String address;
    private String qnumber;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getQname() { return qname; }
    public void setQname(String qname) { this.qname = qname; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getQnumber() { return qnumber; }
    public void setQnumber(String qnumber) { this.qnumber = qnumber; }
}
