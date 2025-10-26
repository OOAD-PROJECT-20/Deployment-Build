package backend.user_profile_backend.service;

import backend.user_profile_backend.dto.CombinedUserResponse;
import backend.user_profile_backend.model.User;
import backend.user_profile_backend.model.Customer;
import backend.user_profile_backend.model.Admin;
import backend.user_profile_backend.repository.UserRepository;
import backend.user_profile_backend.repository.CustomerRepository;
import backend.user_profile_backend.repository.AdminRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    public UserService(UserRepository userRepository,
                       CustomerRepository customerRepository,
                       AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
    }

    private CombinedUserResponse mapToCombinedDto(User u) {

        Customer customer = customerRepository.findByUser(u).orElse(null);
        Admin admin = adminRepository.findByUser(u).orElse(null);

        String authority;
        if (admin != null) {
            if (admin.getAdminLevel() != null) {
                switch (admin.getAdminLevel()) {
                    case 1 -> authority = "ADMIN/OWNER";
                    case 2 -> authority = "ADMIN/STAFF";
                    default -> authority = "ADMIN/" + admin.getAdminLevel();
                }
            } else {
                authority = "ADMIN";
            }
        } else {
            authority = "CUSTOMER";
        }

        return new CombinedUserResponse(
                u.getUserId(),
                u.getUserName(),
                u.getEmail(),
                u.getTelephone(),
                authority,
                customer != null ? customer.getCustomerId() : null,
                admin != null ? admin.getAdminId() : null
        );
    }


    public List<CombinedUserResponse> search(String name, String email, String telephone) {
        return userRepository.findAll().stream()
                .filter(u -> name == null || name.isBlank() || u.getUserName().toLowerCase().contains(name.toLowerCase()))
                .filter(u -> email == null || email.isBlank() || (u.getEmail() != null && u.getEmail().toLowerCase().contains(email.toLowerCase())))
                .filter(u -> telephone == null || telephone.isBlank() || (u.getTelephone() != null && u.getTelephone().contains(telephone)))
                .map(this::mapToCombinedDto)
                .collect(Collectors.toList());
    }
}
