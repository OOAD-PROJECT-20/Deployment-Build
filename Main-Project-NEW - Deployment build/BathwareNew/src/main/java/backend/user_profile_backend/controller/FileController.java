package backend.user_profile_backend.controller;

import backend.user_profile_backend.repository.OrderRepository;
import backend.user_profile_backend.model.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/files")
public class FileController {

    private final OrderRepository orderRepository;

    public FileController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/payment-slip/{orderId}")
    public ResponseEntity<Resource> getPaymentSlip(@PathVariable Long orderId) {
        try {
            // Get order from database
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Get file path
            String filePath = order.getPaymentSlip();
            System.out.println("DEBUG: Original file path from DB: " + filePath);
            
            // Handle both relative and absolute paths
            Path path;
            if (filePath.startsWith("uploads/") || filePath.startsWith("uploads\\")) {
                // Relative path - resolve from current working directory
                path = Paths.get(System.getProperty("user.dir"), filePath);
                System.out.println("DEBUG: Resolved relative path: " + path.toString());
            } else {
                // Absolute path - use as is
                path = Paths.get(filePath);
                System.out.println("DEBUG: Using absolute path: " + path.toString());
            }
            
            System.out.println("DEBUG: Current working directory: " + System.getProperty("user.dir"));
            System.out.println("DEBUG: File exists: " + path.toFile().exists());
            System.out.println("DEBUG: File is readable: " + path.toFile().canRead());
            
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not found or not readable. Path: " + path.toString() + 
                    ", Exists: " + path.toFile().exists() + 
                    ", Readable: " + path.toFile().canRead());
            }

            // Determine content type
            String contentType = "application/octet-stream";
            String filename = path.getFileName().toString();
            if (filename.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (filename.endsWith(".png")) {
                contentType = "image/png";
            } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            throw new RuntimeException("Error reading file", e);
        }
    }
}
