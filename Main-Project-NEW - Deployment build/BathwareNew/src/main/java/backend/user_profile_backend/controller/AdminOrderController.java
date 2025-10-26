package backend.user_profile_backend.controller;

import backend.user_profile_backend.service.AdminOrderService;
import backend.user_profile_backend.dto.OrderDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    // Get all orders
    @GetMapping("/all")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(adminOrderService.getAllOrders());
    }

    // Approve payment
    @PostMapping("/{orderId}/approve-payment")
    public ResponseEntity<?> approvePayment(@PathVariable Long orderId) {
        try {
            adminOrderService.updatePaymentStatus(orderId, "APPROVED");
            return ResponseEntity.ok("Payment approved successfully!");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Reject payment
    @PostMapping("/{orderId}/reject-payment")
    public ResponseEntity<?> rejectPayment(@PathVariable Long orderId) {
        try {
            adminOrderService.updatePaymentStatus(orderId, "REJECTED");
            return ResponseEntity.ok("Payment rejected successfully!");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Update delivery status
    @PostMapping("/{orderId}/delivery-status")
    public ResponseEntity<?> updateDeliveryStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        try {
            adminOrderService.updateDeliveryStatus(orderId, status);
            return ResponseEntity.ok("Delivery status updated successfully!");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}