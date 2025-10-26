package backend.user_profile_backend.controller;

import backend.user_profile_backend.model.Product;
import backend.user_profile_backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        List<Product> products = productService.searchProducts(q);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/category/{categoryId}/search")
    public ResponseEntity<List<Product>> searchProductsByCategory(
            @PathVariable Long categoryId, 
            @RequestParam String q) {
        List<Product> products = productService.searchProductsByCategory(categoryId, q);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<Product>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice, 
            @RequestParam BigDecimal maxPrice) {
        List<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/category/{categoryId}/price-range")
    public ResponseEntity<List<Product>> getProductsByCategoryAndPriceRange(
            @PathVariable Long categoryId,
            @RequestParam BigDecimal minPrice, 
            @RequestParam BigDecimal maxPrice) {
        List<Product> products = productService.getProductsByCategoryAndPriceRange(categoryId, minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/top-rated")
    public ResponseEntity<List<Product>> getTopRatedProducts(@RequestParam(defaultValue = "10") int limit) {
        List<Product> products = productService.getTopRatedProducts(limit);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/latest")
    public ResponseEntity<List<Product>> getLatestProducts(@RequestParam(defaultValue = "10") int limit) {
        List<Product> products = productService.getLatestProducts(limit);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/discounted")
    public ResponseEntity<List<Product>> getDiscountedProducts(@RequestParam(defaultValue = "10") int limit) {
        List<Product> products = productService.getDiscountedProducts(limit);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/in-stock")
    public ResponseEntity<List<Product>> getInStockProducts() {
        List<Product> products = productService.getInStockProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts(@RequestParam(defaultValue = "10") int threshold) {
        List<Product> products = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(products);
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> permanentlyDeleteProduct(@PathVariable Long id) {
        try {
            productService.permanentlyDeleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

