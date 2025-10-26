package backend.user_profile_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;


@Entity
@Table(name = "quotation")
public class Quotation {

    public enum QuotationStatus { PENDING, APPROVED, REJECTED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quotation_id")
    private Long quotationId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "request_date")
    private java.sql.Timestamp requestDate;

    @Column(name = "qname")
    private String qname;

    @Column(name = "address")
    private String address;

    @Column(name = "qnumber")
    private String qnumber;

    @Column(name = "qstatus")
    @Enumerated(EnumType.STRING)
    private QuotationStatus qstatus;

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL)
    private List<QuotationItem> items;

    // Getters & Setters
    public Long getQuotationId() { return quotationId; }
    public void setQuotationId(Long quotationId) { this.quotationId = quotationId; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    public java.sql.Timestamp getRequestDate() { return requestDate; }
    public void setRequestDate(java.sql.Timestamp requestDate) { this.requestDate = requestDate; }
    public String getQname() { return qname; }
    public void setQname(String qname) { this.qname = qname; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getQnumber() { return qnumber; }
    public void setQnumber(String qnumber) { this.qnumber = qnumber; }
    public QuotationStatus getQstatus() { return qstatus; }
    public void setQstatus(QuotationStatus qstatus) { this.qstatus = qstatus; }
    public List<QuotationItem> getItems() { return items; }
    public void setItems(List<QuotationItem> items) { this.items = items; }
}
