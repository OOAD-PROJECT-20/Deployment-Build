package backend.user_profile_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;


@Entity
@Table(name = "orders")
public class Order {

    public enum PaymentStatus { PENDING, APPROVED, REJECTED }
    public enum DeliverStatus { PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "quotation_id", nullable = false)
    private Quotation quotation;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "created_date")
    private Timestamp createdDate;

    @Column(name = "payment_slip", nullable = false)
    private String paymentSlip;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "deliver_status")
    private DeliverStatus deliverStatus = DeliverStatus.PENDING;

    @Column(name = "delivered_date")
    private Timestamp deliveredDate;

    // Getters & Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Quotation getQuotation() { return quotation; }
    public void setQuotation(Quotation quotation) { this.quotation = quotation; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Timestamp getCreatedDate() { return createdDate; }
    public void setCreatedDate(Timestamp createdDate) { this.createdDate = createdDate; }

    public String getPaymentSlip() { return paymentSlip; }
    public void setPaymentSlip(String paymentSlip) { this.paymentSlip = paymentSlip; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public DeliverStatus getDeliverStatus() { return deliverStatus; }
    public void setDeliverStatus(DeliverStatus deliverStatus) { this.deliverStatus = deliverStatus; }

    public Timestamp getDeliveredDate() { return deliveredDate; }
    public void setDeliveredDate(Timestamp deliveredDate) { this.deliveredDate = deliveredDate; }
}
