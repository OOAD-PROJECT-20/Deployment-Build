package backend.user_profile_backend.repository;

import backend.user_profile_backend.model.Admin;
import backend.user_profile_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {


    Optional<Admin> findByUser(User user);
}
