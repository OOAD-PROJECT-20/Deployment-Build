package backend.user_profile_backend.service;

import backend.user_profile_backend.dto.OrderDto;
import backend.user_profile_backend.dto.QuotationItemDto;
import backend.user_profile_backend.model.Order;
import backend.user_profile_backend.repository.OrderRepository;
import backend.user_profile_backend.service.EmailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final EmailService emailService;

    public AdminOrderService(OrderRepository orderRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }

    // Get all orders with details
    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Get orders for a specific customer
    public List<OrderDto> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByCustomerUserId(userId);
        return orders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Update payment status
    @Transactional
    public void updatePaymentStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentStatus(Order.PaymentStatus.valueOf(status));
        orderRepository.save(order);

        // Email notification functionality - disabled for deployment demo
        // NOTE: Email service is configured but disabled to avoid timeout on Render free tier
        // Email config is set in environment variables (SPRING_MAIL_HOST, etc.)
        // Uncomment below to enable email notifications in production with proper SMTP access
        /*
        try {
            if ("APPROVED".equals(status)) {
                String to = order.getCustomer().getEmail();
                String subject = "Payment Approved - Order #" + order.getOrderId();
                String body = "Hello " + order.getQuotation().getQname() + ",\n\n" +
                        "Your payment for Order #" + order.getOrderId() + " has been APPROVED.\n" +
                        "Total Amount: Rs. " + order.getTotalAmount() + "\n\n" +
                        "Your order is now being processed for delivery.\n\n" +
                        "Thank you for your business!";
                emailService.sendEmail(to, subject, body);
            } else if ("REJECTED".equals(status)) {
                String to = order.getCustomer().getEmail();
                String subject = "Payment Rejected - Order #" + order.getOrderId();
                String body = "Hello " + order.getQuotation().getQname() + ",\n\n" +
                        "Unfortunately, your payment for Order #" + order.getOrderId() + " has been REJECTED.\n" +
                        "Please contact us for more information or submit a valid payment slip.\n\n" +
                        "Thank you for your understanding.";
                emailService.sendEmail(to, subject, body);
            }
        } catch (Exception e) {
            // Email failed but status update still succeeds
            System.err.println("Email notification failed: " + e.getMessage());
        }
        */
    }

    // Update delivery status
    @Transactional
    public void updateDeliveryStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setDeliverStatus(Order.DeliverStatus.valueOf(status));

        // If delivered, set delivered date
        if ("DELIVERED".equals(status)) {
            order.setDeliveredDate(new Timestamp(System.currentTimeMillis()));
        }

        orderRepository.save(order);

        // Email notification functionality - disabled for deployment demo
        // NOTE: Email service is configured but disabled to avoid timeout on Render free tier
        // Uncomment below to enable delivery status email notifications in production
        /*
        String to = order.getCustomer().getEmail();
        String subject = "Order Status Update - Order #" + order.getOrderId();
        String body = "Hello " + order.getQuotation().getQname() + ",\n\n" +
                "Your order #" + order.getOrderId() + " status has been updated to: " + status + "\n\n";

        if ("DELIVERED".equals(status)) {
            body += "Your order has been successfully delivered. Thank you for choosing us!\n\n";
        } else if ("SHIPPED".equals(status)) {
            body += "Your order has been shipped and is on its way to you.\n\n";
        } else if ("PROCESSING".equals(status)) {
            body += "Your order is being processed and will be shipped soon.\n\n";
        }

        body += "Thank you for your business!";
        emailService.sendEmail(to, subject, body);
        */
    }

    // Helper method to map Order to OrderDto
    private OrderDto mapToDto(Order o) {
        OrderDto dto = new OrderDto();
        dto.setOrderId(o.getOrderId());
        dto.setQuotationId(o.getQuotation().getQuotationId());
        dto.setCustomerName(o.getQuotation().getQname());
        dto.setCustomerEmail(o.getCustomer().getEmail());
        dto.setAddress(o.getQuotation().getAddress());
        dto.setPhoneNumber(o.getQuotation().getQnumber());
        dto.setTotalAmount(o.getTotalAmount());
        dto.setCreatedDate(o.getCreatedDate());
        dto.setPaymentSlip(o.getPaymentSlip());
        dto.setPaymentStatus(o.getPaymentStatus().name());
        dto.setDeliverStatus(o.getDeliverStatus().name());
        dto.setDeliveredDate(o.getDeliveredDate());

        // Add quotation items
        List<QuotationItemDto> items = o.getQuotation().getItems().stream().map(item -> {
            QuotationItemDto itemDto = new QuotationItemDto();
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setPrice(item.getPrice());
            return itemDto;
        }).collect(Collectors.toList());

        dto.setItems(items);
        return dto;
    }
}