package backend.user_profile_backend.repository;

import backend.user_profile_backend.model.QuotationItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuotationItemRepository extends JpaRepository<QuotationItem, Long> {}
