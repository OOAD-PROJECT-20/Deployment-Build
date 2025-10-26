package backend.user_profile_backend.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

public class QuotationDto {
    private Long quotationId;
    private String qname;
    private String address;
    private String qnumber;
    private String qstatus;
    private Timestamp requestDate;
    private BigDecimal totalPrice;
    private List<QuotationItemDto> items;

    // Getters and Setters
    public Long getQuotationId() { return quotationId; }
    public void setQuotationId(Long quotationId) { this.quotationId = quotationId; }

    public String getQname() { return qname; }
    public void setQname(String qname) { this.qname = qname; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getQnumber() { return qnumber; }
    public void setQnumber(String qnumber) { this.qnumber = qnumber; }

    public String getQstatus() { return qstatus; }
    public void setQstatus(String qstatus) { this.qstatus = qstatus; }

    public Timestamp getRequestDate() { return requestDate; }
    public void setRequestDate(Timestamp requestDate) { this.requestDate = requestDate; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public List<QuotationItemDto> getItems() { return items; }
    public void setItems(List<QuotationItemDto> items) { this.items = items; }
}
