package backend.user_profile_backend.repository;

import backend.user_profile_backend.model.Customer;
import backend.user_profile_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {


    Optional<Customer> findByUser(User user);
}
