package backend.user_profile_backend.config;

import backend.user_profile_backend.model.Category;
import backend.user_profile_backend.model.Product;
import backend.user_profile_backend.repository.CategoryRepository;
import backend.user_profile_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize categories
        initializeCategories();
        // Initialize products
        initializeProducts();
    }

    private void initializeCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                new Category("Showers", "Premium shower systems and accessories"),
                new Category("Taps & Mixers", "High-quality taps, mixers, and faucets"),
                new Category("Tiles", "Ceramic and porcelain bathroom tiles"),
                new Category("Commods", "Toilets and commode systems"),
                new Category("Wash Basins", "Various types of wash basins and sinks"),
                new Category("Accessories", "Bathroom accessories and fixtures")
            );
            categoryRepository.saveAll(categories);
        }
    }

    private void initializeProducts() {
        if (productRepository.count() == 0) {
            List<Category> categories = categoryRepository.findAll();
            
            List<Product> products = Arrays.asList(
                // Showers
                new Product("Premium Shower Head Set", "High-quality shower head with multiple spray patterns", 
                    findCategory(categories, "Showers"), new BigDecimal("15750.00")),
                new Product("Rain Shower System", "Luxury rain shower system with multiple functions", 
                    findCategory(categories, "Showers"), new BigDecimal("25000.00")),
                new Product("Digital Shower Panel", "Smart digital shower panel with temperature control", 
                    findCategory(categories, "Showers"), new BigDecimal("38000.00")),
                
                // Taps & Mixers
                new Product("Modern Basin Mixer Tap", "Contemporary design mixer tap for wash basins", 
                    findCategory(categories, "Taps & Mixers"), new BigDecimal("8500.00")),
                new Product("Double Handle Basin Tap", "Classic double handle tap for traditional bathrooms", 
                    findCategory(categories, "Taps & Mixers"), new BigDecimal("6500.00")),
                new Product("Kitchen Sink Mixer", "Professional kitchen sink mixer with pull-out spray", 
                    findCategory(categories, "Taps & Mixers"), new BigDecimal("9800.00")),
                new Product("Sensor Tap Automatic", "Touchless automatic sensor tap for hygiene", 
                    findCategory(categories, "Taps & Mixers"), new BigDecimal("12000.00")),
                new Product("Luxury Bathtub Faucet", "Premium bathtub faucet with elegant design", 
                    findCategory(categories, "Taps & Mixers"), new BigDecimal("32000.00")),
                
                // Tiles
                new Product("Ceramic Wall Tiles - Ocean Blue", "Beautiful ocean blue ceramic tiles for bathroom walls", 
                    findCategory(categories, "Tiles"), new BigDecimal("2800.00")),
                new Product("Marble Floor Tiles", "Premium marble floor tiles for elegant bathrooms", 
                    findCategory(categories, "Tiles"), new BigDecimal("4200.00")),
                new Product("Mosaic Wall Tiles", "Decorative mosaic tiles for accent walls", 
                    findCategory(categories, "Tiles"), new BigDecimal("3500.00")),
                
                // Commods
                new Product("Smart Toilet Commode", "Advanced smart toilet with bidet functionality", 
                    findCategory(categories, "Commods"), new BigDecimal("45000.00")),
                new Product("Wall Mounted Toilet", "Space-saving wall mounted toilet system", 
                    findCategory(categories, "Commods"), new BigDecimal("35000.00")),
                new Product("Bidet Toilet Seat", "Advanced bidet toilet seat with multiple features", 
                    findCategory(categories, "Commods"), new BigDecimal("22000.00")),
                new Product("Close Coupled Toilet", "Standard close coupled toilet with soft close seat", 
                    findCategory(categories, "Commods"), new BigDecimal("28000.00")),
                
                // Wash Basins
                new Product("Ceramic Wash Basin", "Elegant ceramic wash basin with modern design", 
                    findCategory(categories, "Wash Basins"), new BigDecimal("18750.00")),
                new Product("Granite Counter Basin", "Luxury granite counter basin with premium finish", 
                    findCategory(categories, "Wash Basins"), new BigDecimal("28000.00")),
                new Product("Pedestal Wash Basin", "Classic pedestal wash basin design", 
                    findCategory(categories, "Wash Basins"), new BigDecimal("16500.00")),
                new Product("Corner Wash Basin", "Space-efficient corner wash basin", 
                    findCategory(categories, "Wash Basins"), new BigDecimal("14000.00")),
                
                // Accessories
                new Product("Bathroom Mirror Cabinet", "Spacious mirror cabinet with LED lighting", 
                    findCategory(categories, "Accessories"), new BigDecimal("12300.00")),
                new Product("Heated Towel Rack", "Electric heated towel rack for luxury bathrooms", 
                    findCategory(categories, "Accessories"), new BigDecimal("15000.00")),
                new Product("Bathroom Exhaust Fan", "Quiet and efficient bathroom exhaust fan", 
                    findCategory(categories, "Accessories"), new BigDecimal("4500.00"))
            );

            // Set additional product properties
            for (Product product : products) {
                product.setOriginalPrice(product.getPrice().multiply(new BigDecimal("1.15")));
                product.setDiscountPercentage(15L);
                product.setImageUrl("https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&h=300&fit=crop");
                product.setRating(new BigDecimal("4.7"));
                product.setReviewCount(100L);
                product.setStockQuantity(50L);
                product.setIsActive(true);
            }

            productRepository.saveAll(products);
        }
    }

    private Category findCategory(List<Category> categories, String name) {
        return categories.stream()
                .filter(category -> category.getName().equals(name))
                .findFirst()
                .orElse(categories.get(0));
    }
}

