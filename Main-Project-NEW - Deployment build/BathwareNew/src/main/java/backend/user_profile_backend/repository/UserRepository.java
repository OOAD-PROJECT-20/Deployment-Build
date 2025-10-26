package backend.user_profile_backend.repository;

import backend.user_profile_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByUserNameContainingIgnoreCase(String userName);
    List<User> findByemailContainingIgnoreCase(String email);
    List<User> findBytelephoneContaining(String telephone);

    Optional<User> findByUserName(String userName);
    Optional<User> findByemail(String email);
    Optional<User> findBytelephone(String telephone);
}
