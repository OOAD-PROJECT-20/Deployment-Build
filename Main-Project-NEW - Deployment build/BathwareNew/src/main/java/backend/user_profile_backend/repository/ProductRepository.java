package backend.user_profile_backend.repository;

import backend.user_profile_backend.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByIsActiveTrue();
    
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Product> searchProducts(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.category.id = :categoryId AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Product> searchProductsByCategory(@Param("categoryId") Long categoryId, @Param("searchTerm") String searchTerm);
    
    List<Product> findByPriceBetweenAndIsActiveTrue(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Product> findByCategoryIdAndPriceBetweenAndIsActiveTrue(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.rating DESC")
    List<Product> findTopRatedProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.createdAt DESC")
    List<Product> findLatestProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.discountPercentage > 0 ORDER BY p.discountPercentage DESC")
    List<Product> findDiscountedProducts(Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    Long countByCategoryId(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity > 0")
    List<Product> findInStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity <= :threshold")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);
}

