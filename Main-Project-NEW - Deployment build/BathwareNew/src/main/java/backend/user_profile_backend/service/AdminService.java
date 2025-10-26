package backend.user_profile_backend.service;

import backend.user_profile_backend.dto.QuotationDto;
import backend.user_profile_backend.dto.QuotationItemDto;
import backend.user_profile_backend.model.Quotation;
import backend.user_profile_backend.repository.OrderRepository;
import backend.user_profile_backend.repository.QuotationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final QuotationRepository quotationRepository;
    private final EmailService emailService;
    private final OrderRepository orderRepository;

    public AdminService(QuotationRepository quotationRepository,
                        EmailService emailService,
                        OrderRepository orderRepository) {
        this.quotationRepository = quotationRepository;
        this.emailService = emailService;
        this.orderRepository = orderRepository;
    }

    // Get all quotations with items
    public List<QuotationDto> getAllQuotations() {
        List<Quotation> quotations = quotationRepository.findAll();
        return quotations.stream().map(this::mapToDto).toList();
    }

    // Get approved quotations for a specific user that are NOT paid yet
    public List<QuotationDto> getApprovedQuotationsForUser(Long userId) {
        // Get all approved quotations for the user
        List<Quotation> approvedQuotations = quotationRepository
                .findByCustomerUserIdAndQstatus(userId, Quotation.QuotationStatus.APPROVED);

        // Get all quotation IDs that already have an order
        List<Long> paidQuotationIds = orderRepository.findAll().stream()
                .map(o -> o.getQuotation().getQuotationId())
                .toList();

        // Filter out paid quotations and display only ones for which the payment is still pending
        return approvedQuotations.stream()
                .filter(q -> !paidQuotationIds.contains(q.getQuotationId()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Approve or Reject quotation
    @Transactional
    public void updateQuotationStatus(Long quotationId, String status) {
        Quotation quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));
        quotation.setQstatus(Quotation.QuotationStatus.valueOf(status));
        quotationRepository.save(quotation);

        if ("APPROVED".equals(status)) {
            try {
                String to = quotation.getCustomer().getEmail();
                String subject = "Your Quotation is Approved";
                String body = "Hello " + quotation.getQname() + ",\n\n" +
                        "Your quotation with ID " + quotation.getQuotationId() + " has been APPROVED.\n" +
                        "Total Price: Rs. " + quotation.getTotalPrice() + "\n\n" +
                        "You can now proceed with making your payment\n\n" +
                        "We will ensure product delivery as soon as possible\n\n" +
                        "Thank you for choosing us!";
                emailService.sendEmail(to, subject, body);
            } catch (Exception e) {
                // Email failed but approval still succeeds
                System.err.println("Email notification failed: " + e.getMessage());
            }
        }
    }


    private QuotationDto mapToDto(Quotation q) {
        QuotationDto dto = new QuotationDto();
        dto.setQuotationId(q.getQuotationId());
        dto.setQname(q.getQname());
        dto.setAddress(q.getAddress());
        dto.setQnumber(q.getQnumber());
        dto.setQstatus(q.getQstatus().name());
        dto.setRequestDate(q.getRequestDate());
        dto.setTotalPrice(q.getTotalPrice());

        List<QuotationItemDto> items = q.getItems().stream().map(item -> {
            QuotationItemDto itemDto = new QuotationItemDto();
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setPrice(item.getPrice());
            return itemDto;
        }).toList();

        dto.setItems(items);
        return dto;
    }
}