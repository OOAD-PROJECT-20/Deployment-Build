package backend.user_profile_backend.repository;

import backend.user_profile_backend.model.Support;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportRepository extends JpaRepository<Support, Long> {
    List<Support> findByUserId(Long userId);
}
