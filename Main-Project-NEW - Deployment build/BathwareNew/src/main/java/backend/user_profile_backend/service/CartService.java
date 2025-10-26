package backend.user_profile_backend.service;

import backend.user_profile_backend.model.Cart;
import backend.user_profile_backend.model.User;
import backend.user_profile_backend.model.Product;
import backend.user_profile_backend.repository.UserRepository;
import backend.user_profile_backend.repository.CartRepository;
import backend.user_profile_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Cart> getCartByUserId(Long userId) {
        return cartRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Cart addToCart(Long userId, Long productId, Long quantity) {
        // Validate user exists
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        
        // Validate product exists and is active
        Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty() || !product.get().getIsActive()) {
            throw new IllegalArgumentException("Product not found or inactive with id: " + productId);
        }
        
        // Check if product is in stock
        if (product.get().getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + product.get().getStockQuantity());
        }
        
        // Check if item already exists in cart
        Optional<Cart> existingCartItem = cartRepository.findByUserIdAndProductId(userId, productId);
        
        if (existingCartItem.isPresent()) {
            // Update quantity
            Cart cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            return cartRepository.save(cartItem);
        } else {
            // Create new cart item
            Cart cartItem = new Cart(user.get(), product.get(), quantity);
            return cartRepository.save(cartItem);
        }
    }
    
    public Cart updateCartItemQuantity(Long userId, Long productId, Long quantity) {
        Optional<Cart> cartItem = cartRepository.findByUserIdAndProductId(userId, productId);
        if (cartItem.isEmpty()) {
            throw new IllegalArgumentException("Cart item not found for user: " + userId + " and product: " + productId);
        }
        
        if (quantity <= 0) {
            cartRepository.deleteByUserIdAndProductId(userId, productId);
            return null;
        }
        
        // Check stock availability
        Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty() || !product.get().getIsActive()) {
            throw new IllegalArgumentException("Product not found or inactive with id: " + productId);
        }
        
        if (product.get().getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + product.get().getStockQuantity());
        }
        
        Cart cart = cartItem.get();
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }
    
    public void removeFromCart(Long userId, Long productId) {
        cartRepository.deleteByUserIdAndProductId(userId, productId);
    }
    
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
    
    public int getTotalItemsInCart(Long userId) {
        Integer totalItems = cartRepository.getTotalItemsInCart(userId);
        return totalItems != null ? totalItems : 0;
    }
    
    public double getTotalCartValue(Long userId) {
        Double totalValue = cartRepository.getTotalCartValue(userId);
        return totalValue != null ? totalValue : 0.0;
    }
    
    public long getCartItemCount(Long userId) {
        Long count = cartRepository.countByUserId(userId);
        return count != null ? count : 0;
    }
    
    public boolean isProductInCart(Long userId, Long productId) {
        return cartRepository.findByUserIdAndProductId(userId, productId).isPresent();
    }
}

