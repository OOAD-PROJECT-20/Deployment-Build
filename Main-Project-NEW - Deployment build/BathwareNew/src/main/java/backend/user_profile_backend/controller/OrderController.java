package backend.user_profile_backend.controller;

import backend.user_profile_backend.dto.OrderDto;
import backend.user_profile_backend.repository.OrderRepository;
import backend.user_profile_backend.service.AdminOrderService;
import backend.user_profile_backend.service.OrderService;
import backend.user_profile_backend.model.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final AdminOrderService adminOrderService;

    public OrderController(OrderService orderService, OrderRepository orderRepository, AdminOrderService adminOrderService) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.adminOrderService = adminOrderService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPaymentSlip(
            @RequestParam("quotationId") Long quotationId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Order order = orderService.createOrder(quotationId, file);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upload payment slip: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> getOrdersByUser(@PathVariable Long userId) {
        List<OrderDto> orders = adminOrderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
}
