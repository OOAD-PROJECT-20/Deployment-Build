package backend.user_profile_backend.service;

import backend.user_profile_backend.model.Category;
import backend.user_profile_backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Category> getAllCategories() {
        return categoryRepository.findByIsActiveTrue();
    }
    
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }
    
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }
    
    public List<Category> searchCategories(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllCategories();
        }
        return categoryRepository.findByNameContaining(name.trim());
    }
    
    public Category createCategory(Category category) {
        // Check if category with same name already exists
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category with name '" + category.getName() + "' already exists");
        }
        
        return categoryRepository.save(category);
    }
    
    public Category updateCategory(Long id, Category categoryDetails) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            throw new IllegalArgumentException("Category not found with id: " + id);
        }
        
        Category category = optionalCategory.get();
        
        // Check if new name conflicts with existing category
        if (categoryDetails.getName() != null && !categoryDetails.getName().equals(category.getName())) {
            if (categoryRepository.existsByName(categoryDetails.getName())) {
                throw new IllegalArgumentException("Category with name '" + categoryDetails.getName() + "' already exists");
            }
            category.setName(categoryDetails.getName());
        }
        
        if (categoryDetails.getDescription() != null) {
            category.setDescription(categoryDetails.getDescription());
        }
        
        return categoryRepository.save(category);
    }
    
    public void deleteCategory(Long id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            throw new IllegalArgumentException("Category not found with id: " + id);
        }
        
        Category category = optionalCategory.get();
        category.setIsActive(false);
        categoryRepository.save(category);
    }
    
    public void permanentlyDeleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
    
    public boolean categoryExists(String name) {
        return categoryRepository.existsByName(name);
    }
}

