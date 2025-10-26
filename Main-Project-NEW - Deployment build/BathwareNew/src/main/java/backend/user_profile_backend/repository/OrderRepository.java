package backend.user_profile_backend.repository;

import backend.user_profile_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerUserId(Long userId);
    Optional<Order> findByQuotationQuotationId(Long quotationId);
    boolean existsByQuotationQuotationId(Long quotationId);
}