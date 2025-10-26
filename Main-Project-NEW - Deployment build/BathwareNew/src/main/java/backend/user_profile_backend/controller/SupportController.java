package backend.user_profile_backend.controller;

import backend.user_profile_backend.model.Support;
import backend.user_profile_backend.repository.SupportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Autowired
    private SupportRepository supportRepository;

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        try {
            System.out.println("🧪 TEST endpoint called");
            long count = supportRepository.count();
            System.out.println("✅ Successfully connected to support table. Row count: " + count);
            return ResponseEntity.ok("Support table exists. Row count: " + count);
        } catch (Exception e) {
            System.err.println("❌ Error accessing support table: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping
    public Support createTicket(@RequestBody Support support) {
        support.setTicketId(null);
        if (support.getStatus() == null) {
            support.setStatus("Pending");
        }
        return supportRepository.save(support);
    }

    @GetMapping
    public ResponseEntity<?> getAllTickets() {
        try {
            System.out.println("🔍 GET /api/support called - Fetching all tickets");
            List<Support> tickets = supportRepository.findAll();
            System.out.println("✅ Found " + tickets.size() + " tickets");
            for (Support ticket : tickets) {
                System.out.println("  - Ticket ID: " + ticket.getTicketId() + 
                                 ", UserID: " + ticket.getUserId() + 
                                 ", Type: " + ticket.getSupportType());
            }
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            System.err.println("❌ Error fetching tickets: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public String deleteTicket(@PathVariable Long id) {
        if (supportRepository.existsById(id)) {
            supportRepository.deleteById(id);
            return "Ticket ID " + id + " deleted successfully.";
        } else {
            return "Ticket ID " + id + " not found.";
        }
    }

    @PutMapping("/{id}/remark")
    public ResponseEntity<?> updateRemark(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Support> ticketOpt = supportRepository.findById(id);
        if (ticketOpt.isPresent()) {
            Support ticket = ticketOpt.get();
            ticket.setRemark(payload.get("remark"));
            supportRepository.save(ticket);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Support> ticketOpt = supportRepository.findById(id);
        if (ticketOpt.isPresent()) {
            Support ticket = ticketOpt.get();
            ticket.setStatus(payload.get("status"));
            supportRepository.save(ticket);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
