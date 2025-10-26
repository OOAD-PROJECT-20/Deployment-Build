package backend.user_profile_backend.service;

import backend.user_profile_backend.model.*;
import backend.user_profile_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Service
public class CheckoutService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final QuotationRepository quotationRepository;
    private final QuotationItemRepository quotationItemsRepository;

    public CheckoutService(UserRepository userRepository,
                           ProductRepository productRepository,
                           CartRepository cartRepository,
                           QuotationRepository quotationRepository,
                           QuotationItemRepository quotationItemsRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.quotationRepository = quotationRepository;
        this.quotationItemsRepository = quotationItemsRepository;
    }

    // Cart Methods
    public List<Cart> getUserCart(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public Cart addToCart(Long userId, Long productId, Long quantity) {
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setProduct(product);
        cart.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartQuantity(Long cartId, Long quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    @Transactional
    public void deleteCartItem(Long cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new RuntimeException("Cart item not found");
        }
        cartRepository.deleteById(cartId);
    }

    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @Transactional
    public Quotation createQuotation(Long userId, String qname, String address, String qnumber) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        BigDecimal total = cartItems.stream()
                .map(c -> c.getProduct().getPrice().multiply(BigDecimal.valueOf(c.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        User user = userRepository.findById(userId).orElseThrow();
        Quotation quotation = new Quotation();
        quotation.setCustomer(user);
        quotation.setQname(qname);
        quotation.setAddress(address);
        quotation.setQnumber(qnumber);
        quotation.setQstatus(Quotation.QuotationStatus.PENDING);
        quotation.setTotalPrice(total);
        quotation.setRequestDate(new Timestamp(System.currentTimeMillis()));

        Quotation savedQuotation = quotationRepository.save(quotation);

        for (Cart cartItem : cartItems) {
            QuotationItem item = new QuotationItem();
            item.setQuotation(savedQuotation);
            item.setProduct(cartItem.getProduct());
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(cartItem.getProduct().getPrice());
            quotationItemsRepository.save(item);
        }

        cartRepository.deleteByUserId(userId);

        return savedQuotation;
    }
}
