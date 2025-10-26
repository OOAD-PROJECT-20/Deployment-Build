package backend.user_profile_backend.service;

import backend.user_profile_backend.model.Category;
import backend.user_profile_backend.model.Product;
import backend.user_profile_backend.repository.CategoryRepository;
import backend.user_profile_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findByIsActiveTrue();
    }
    
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }
    
    public List<Product> searchProducts(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchProducts(searchTerm.trim());
    }
    
    public List<Product> searchProductsByCategory(Long categoryId, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getProductsByCategory(categoryId);
        }
        return productRepository.searchProductsByCategory(categoryId, searchTerm.trim());
    }
    
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetweenAndIsActiveTrue(minPrice, maxPrice);
    }
    
    public List<Product> getProductsByCategoryAndPriceRange(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByCategoryIdAndPriceBetweenAndIsActiveTrue(categoryId, minPrice, maxPrice);
    }
    
    public List<Product> getTopRatedProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findTopRatedProducts(pageable);
    }
    
    public List<Product> getLatestProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findLatestProducts(pageable);
    }
    
    public List<Product> getDiscountedProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findDiscountedProducts(pageable);
    }
    
    public List<Product> getInStockProducts() {
        return productRepository.findInStockProducts();
    }
    
    public List<Product> getLowStockProducts(int threshold) {
        return productRepository.findLowStockProducts(threshold);
    }
    
    public Product createProduct(Product product) {
        // Validate category exists
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Optional<Category> category = categoryRepository.findById(product.getCategory().getId());
            if (category.isEmpty()) {
                throw new IllegalArgumentException("Category not found with id: " + product.getCategory().getId());
            }
            product.setCategory(category.get());
        }
        
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
        
        Product product = optionalProduct.get();
        
        // Update fields
        if (productDetails.getName() != null) {
            product.setName(productDetails.getName());
        }
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Optional<Category> category = categoryRepository.findById(productDetails.getCategory().getId());
            if (category.isEmpty()) {
                throw new IllegalArgumentException("Category not found with id: " + productDetails.getCategory().getId());
            }
            product.setCategory(category.get());
        }
        if (productDetails.getPrice() != null) {
            product.setPrice(productDetails.getPrice());
        }
        if (productDetails.getOriginalPrice() != null) {
            product.setOriginalPrice(productDetails.getOriginalPrice());
        }
        if (productDetails.getDiscountPercentage() != null) {
            product.setDiscountPercentage(productDetails.getDiscountPercentage());
        }
        if (productDetails.getImageUrl() != null) {
            product.setImageUrl(productDetails.getImageUrl());
        }
        if (productDetails.getRating() != null) {
            product.setRating(productDetails.getRating());
        }
        if (productDetails.getReviewCount() != null) {
            product.setReviewCount(productDetails.getReviewCount());
        }
        if (productDetails.getStockQuantity() != null) {
            product.setStockQuantity(productDetails.getStockQuantity());
        }
        if (productDetails.getIsActive() != null) {
            product.setIsActive(productDetails.getIsActive());
        }
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
        
        Product product = optionalProduct.get();
        product.setIsActive(false);
        productRepository.save(product);
    }
    
    public void permanentlyDeleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
    
    public long getProductCountByCategory(Long categoryId) {
        return productRepository.countByCategoryId(categoryId);
    }
}

