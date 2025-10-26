package backend.user_profile_backend.controller;

import backend.user_profile_backend.repository.CartRepository;
import backend.user_profile_backend.repository.ProductRepository;
import backend.user_profile_backend.model.Cart;
import backend.user_profile_backend.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class DataViewController {

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private ProductRepository productRepo;

    @GetMapping("/view/carts")
    public List<Cart> getCarts() {
        return cartRepo.findAll();
    }

    @GetMapping("/view/products")
    public List<Product> getProducts() {
        return productRepo.findAll();
    }
}


