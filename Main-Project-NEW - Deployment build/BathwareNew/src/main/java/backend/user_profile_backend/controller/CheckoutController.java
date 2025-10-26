package backend.user_profile_backend.controller;

import backend.user_profile_backend.model.Cart;
import backend.user_profile_backend.service.CheckoutService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    // Get all cart items for a specific user
    @GetMapping("/cart/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) {
        return checkoutService.getUserCart(userId);
    }

    // Get all cart items
    @GetMapping("/cart")
    public List<Cart> getAllCarts() {
        return checkoutService.getAllCarts();
    }

    // Add product to cart
    @PostMapping("/cart/add")
    public Cart addToCart(@RequestParam Long userId,
                          @RequestParam Long productId,
                          @RequestParam Long quantity) {
        return checkoutService.addToCart(userId, productId, quantity);
    }

    //Update cart item quantity
    @PutMapping("/cart/update/{cartId}")
    public Cart updateCartQuantity(@PathVariable Long cartId,
                                   @RequestParam Long quantity) {
        return checkoutService.updateCartQuantity(cartId, quantity);
    }

    //Delete a specific cart item
    @DeleteMapping("/cart/delete/{cartId}")
    public void deleteCartItem(@PathVariable Long cartId) {
        checkoutService.deleteCartItem(cartId);
    }

    // Clear a user's cart
    @DeleteMapping("/cart/clear/{userId}")
    public void clearCart(@PathVariable Long userId) {
        checkoutService.clearCart(userId);
    }
}