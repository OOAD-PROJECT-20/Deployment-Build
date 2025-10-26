package backend.user_profile_backend.service;

import backend.user_profile_backend.repository.OrderRepository;
import backend.user_profile_backend.repository.ProductRepository;
import backend.user_profile_backend.repository.QuotationItemRepository;
import backend.user_profile_backend.repository.QuotationRepository;
import backend.user_profile_backend.model.Order;
import backend.user_profile_backend.model.Product;
import backend.user_profile_backend.model.Quotation;
import backend.user_profile_backend.model.QuotationItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final QuotationRepository quotationRepository;
    private final ProductRepository productRepository;
    private final QuotationItemRepository quotationItemRepository;

    @Value("${uploads.dir:uploads}")
    private String uploadsDir;

    public OrderService(OrderRepository orderRepository,
                        QuotationRepository quotationRepository,
                        ProductRepository productRepository,
                        QuotationItemRepository quotationItemRepository) {
        this.orderRepository = orderRepository;
        this.quotationRepository = quotationRepository;
        this.productRepository = productRepository;
        this.quotationItemRepository = quotationItemRepository;
    }

    @Transactional
    public Order createOrder(Long quotationId, MultipartFile paymentSlip) throws IOException {
        Quotation quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        //Check if order already exists for this quotation
        if (orderRepository.existsByQuotationQuotationId(quotationId)) {
            throw new RuntimeException("Payment already submitted for this quotation");
        }

        // Store file
        System.out.println("DEBUG: Uploads directory: " + uploadsDir);
        File uploadFolder = new File(uploadsDir);
        if (!uploadFolder.exists()) {
            System.out.println("DEBUG: Creating uploads directory: " + uploadsDir);
            uploadFolder.mkdirs();
        }

        String filePath = uploadsDir + File.separator + System.currentTimeMillis() + "_" + paymentSlip.getOriginalFilename();
        System.out.println("DEBUG: Full file path: " + filePath);
        File dest = new File(filePath);
        paymentSlip.transferTo(dest);
        System.out.println("DEBUG: File saved successfully to: " + filePath);

        // Save order
        Order order = new Order();
        order.setQuotation(quotation);
        order.setPaymentSlip(filePath);
        order.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setDeliverStatus(Order.DeliverStatus.PENDING);
        order.setCustomer(quotation.getCustomer());
        order.setTotalAmount(quotation.getTotalPrice());

        Order savedOrder = orderRepository.save(order);

        // Deduct stock quantities from products
        deductStockForQuotation(quotationId);

        return savedOrder;
    }

    // Method to deduct stock after payment submission
    @Transactional
    private void deductStockForQuotation(Long quotationId) {
        Quotation quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        for (QuotationItem item : quotation.getItems()) {
            Product product = item.getProduct();
            Long orderedQuantity = item.getQuantity();
            Long currentStock = product.getStockQuantity();

            if (currentStock < orderedQuantity) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() +
                        ". Available: " + currentStock + ", Ordered: " + orderedQuantity);
            }

            // Deduct the quantity
            product.setStockQuantity(currentStock - orderedQuantity);
            productRepository.save(product);
        }
    }
}