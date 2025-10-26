package backend.user_profile_backend.repository;

import backend.user_profile_backend.model.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    List<Quotation> findByCustomerUserIdAndQstatus(Long userId, Quotation.QuotationStatus qstatus);
}
