package backend.user_profile_backend.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

public class OrderDto {
    private Long orderId;
    private Long quotationId;
    private String customerName;
    private String customerEmail;
    private String address;
    private String phoneNumber;
    private BigDecimal totalAmount;
    private Timestamp createdDate;
    private String paymentSlip;
    private String paymentStatus;
    private String deliverStatus;
    private Timestamp deliveredDate;
    private List<QuotationItemDto> items;

    // Getters and Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getQuotationId() { return quotationId; }
    public void setQuotationId(Long quotationId) { this.quotationId = quotationId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Timestamp getCreatedDate() { return createdDate; }
    public void setCreatedDate(Timestamp createdDate) { this.createdDate = createdDate; }

    public String getPaymentSlip() { return paymentSlip; }
    public void setPaymentSlip(String paymentSlip) { this.paymentSlip = paymentSlip; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getDeliverStatus() { return deliverStatus; }
    public void setDeliverStatus(String deliverStatus) { this.deliverStatus = deliverStatus; }

    public Timestamp getDeliveredDate() { return deliveredDate; }
    public void setDeliveredDate(Timestamp deliveredDate) { this.deliveredDate = deliveredDate; }

    public List<QuotationItemDto> getItems() { return items; }
    public void setItems(List<QuotationItemDto> items) { this.items = items; }
}