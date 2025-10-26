package backend.user_profile_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @NotNull(message = "Category is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "Original price must be greater than or equal to 0")
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Min(value = 0, message = "Discount percentage must be 0 or greater")
    @Max(value = 100, message = "Discount percentage must not exceed 100")
    @Column(name = "discount_percentage")
    private Long discountPercentage = 0L;
    
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @DecimalMin(value = "0.0", message = "Rating must be 0 or greater")
    @DecimalMax(value = "5.0", message = "Rating must not exceed 5")
    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;
    
    @Min(value = 0, message = "Review count must be 0 or greater")
    @Column(name = "review_count")
    private Long reviewCount = 0L;
    
    @Min(value = 0, message = "Stock quantity must be 0 or greater")
    @Column(name = "stock_quantity")
    private Long stockQuantity = 0L;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Cart> cartItems;
    
    // Constructors
    public Product() {}
    
    public Product(String name, String description, Category category, BigDecimal price) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
    }
    
    // JPA lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }
    
    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }
    
    public Long getDiscountPercentage() {
        return discountPercentage;
    }
    
    public void setDiscountPercentage(Long discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public BigDecimal getRating() {
        return rating;
    }
    
    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }
    
    public Long getReviewCount() {
        return reviewCount;
    }
    
    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }
    
    public Long getStockQuantity() {
        return stockQuantity;
    }
    
    public void setStockQuantity(Long stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<Cart> getCartItems() {
        return cartItems;
    }
    
    public void setCartItems(List<Cart> cartItems) {
        this.cartItems = cartItems;
    }
}

