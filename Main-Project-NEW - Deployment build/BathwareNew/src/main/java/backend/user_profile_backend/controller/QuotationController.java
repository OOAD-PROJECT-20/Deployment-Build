package backend.user_profile_backend.controller;

import backend.user_profile_backend.service.AdminService;
import backend.user_profile_backend.service.CheckoutService;
import backend.user_profile_backend.dto.QuotationDto;
import backend.user_profile_backend.dto.QuotationRequestDto;
import backend.user_profile_backend.model.Quotation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/checkout/quotation")
public class QuotationController {

    private final CheckoutService checkoutService;
    private final AdminService adminService;

    public QuotationController(CheckoutService checkoutService, AdminService adminService) {
        this.checkoutService = checkoutService;
        this.adminService = adminService;
    }

    // ------------------ Customer Request ------------------
    @PostMapping("/request")
    public ResponseEntity<?> requestQuotation(@RequestBody QuotationRequestDto dto) {
        try {
            Quotation saved = checkoutService.createQuotation(
                    dto.getUserId(),
                    dto.getQname(),
                    dto.getAddress(),
                    dto.getQnumber()
            );
            return ResponseEntity.status(201).body(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Failed to create quotation: " + ex.getMessage());
        }
    }

    // ------------------ Admin Endpoints ------------------
    @GetMapping("/admin/all")
    public ResponseEntity<List<QuotationDto>> getAllQuotations() {
        return ResponseEntity.ok(adminService.getAllQuotations());
    }

    @PostMapping("/admin/{id}/approve")
    public ResponseEntity<?> approveQuotation(@PathVariable Long id) {
        try {
            adminService.updateQuotationStatus(id, "APPROVED");
            return ResponseEntity.ok("Quotation approved successfully!");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/admin/{id}/reject")
    public ResponseEntity<?> rejectQuotation(@PathVariable Long id) {
        try {
            adminService.updateQuotationStatus(id, "REJECTED");
            return ResponseEntity.ok("Quotation rejected successfully!");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ------------------ Customer Approved Quotations ------------------
    @GetMapping("/customer/{userId}/approved")
    public ResponseEntity<List<QuotationDto>> getApprovedQuotationsForUser(@PathVariable Long userId) {
        List<QuotationDto> approved = adminService.getApprovedQuotationsForUser(userId);
        return ResponseEntity.ok(approved);
    }
}
