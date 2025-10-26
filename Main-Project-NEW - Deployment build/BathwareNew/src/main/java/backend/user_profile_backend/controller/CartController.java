package backend.user_profile_backend.controller;

import backend.user_profile_backend.model.Cart;
import backend.user_profile_backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Cart>> getCartByUserId(@PathVariable Long userId) {
        List<Cart> cartItems = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }
    
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Long quantity) {
        try {
            Cart cartItem = cartService.addToCart(userId, productId, quantity);
            return ResponseEntity.status(HttpStatus.CREATED).body(cartItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<Cart> updateCartItemQuantity(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Long quantity) {
        try {
            Cart cartItem = cartService.updateCartItemQuantity(userId, productId, quantity);
            if (cartItem == null) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(cartItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long productId) {
        try {
            cartService.removeFromCart(userId, productId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/user/{userId}/total-items")
    public ResponseEntity<Integer> getTotalItemsInCart(@PathVariable Long userId) {
        int totalItems = cartService.getTotalItemsInCart(userId);
        return ResponseEntity.ok(totalItems);
    }
    
    @GetMapping("/user/{userId}/total-value")
    public ResponseEntity<Double> getTotalCartValue(@PathVariable Long userId) {
        double totalValue = cartService.getTotalCartValue(userId);
        return ResponseEntity.ok(totalValue);
    }
    
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getCartItemCount(@PathVariable Long userId) {
        long count = cartService.getCartItemCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/user/{userId}/product/{productId}/exists")
    public ResponseEntity<Boolean> isProductInCart(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        boolean exists = cartService.isProductInCart(userId, productId);
        return ResponseEntity.ok(exists);
    }
}

