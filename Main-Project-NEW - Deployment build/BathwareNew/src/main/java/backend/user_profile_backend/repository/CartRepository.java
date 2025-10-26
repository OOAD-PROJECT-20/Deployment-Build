package backend.user_profile_backend.repository;

import backend.user_profile_backend.model.Cart;
import backend.user_profile_backend.model.User;
import backend.user_profile_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Find all cart items for a user
    @Query("SELECT c FROM Cart c WHERE c.user.userId = :userId")
    List<Cart> findByUserId(@Param("userId") Long userId);

    // Find all cart items for a user ordered by creation date
    @Query("SELECT c FROM Cart c WHERE c.user.userId = :userId ORDER BY c.createdAt DESC")
    List<Cart> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    // Find a cart item by User and Product
    Optional<Cart> findByUserAndProduct(User user, Product product);

    // Find a cart item by userId and productId
    @Query("SELECT c FROM Cart c WHERE c.user.userId = :userId AND c.product.id = :productId")
    Optional<Cart> findByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    // Total quantity of items in cart
    @Query("SELECT SUM(c.quantity) FROM Cart c WHERE c.user.userId = :userId")
    Integer getTotalItemsInCart(@Param("userId") Long userId);

    // Total value of items in cart
    @Query("SELECT SUM(c.quantity * c.product.price) FROM Cart c WHERE c.user.userId = :userId")
    Double getTotalCartValue(@Param("userId") Long userId);

    // Count of cart items
    @Query("SELECT COUNT(c) FROM Cart c WHERE c.user.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);

    // Delete operations
    @Modifying
    @Query("DELETE FROM Cart c WHERE c.user.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Cart c WHERE c.user.userId = :userId AND c.product.id = :productId")
    void deleteByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    @Modifying
    void deleteByUser(User user);

    @Modifying
    void deleteByUserAndProduct(User user, Product product);
}
