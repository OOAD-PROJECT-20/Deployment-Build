package backend.user_profile_backend.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import backend.user_profile_backend.dto.SignUpRequest;
import backend.user_profile_backend.model.User;
import backend.user_profile_backend.model.Customer;
import backend.user_profile_backend.repository.UserRepository;
import backend.user_profile_backend.repository.CustomerRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public AuthService(UserRepository userRepository,
                       CustomerRepository customerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }


    public Optional<User> authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUserName(username);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByemail(username);
        }
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findBytelephone(username);
        }
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt;
        }
        return Optional.empty();
    }


    public Map<String, Object> signUp(SignUpRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.findByUserName(request.getUsername()).isPresent()) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return response;
        }

        if (userRepository.findByemail(request.getEmail()).isPresent()) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }

        if (userRepository.findBytelephone(request.getTelephone()).isPresent()) {
            response.put("success", false);
            response.put("message", "Telephone number already exists");
            return response;
        }


        User newUser = new User();
        newUser.setUserName(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setTelephone(request.getTelephone());
        newUser.setPassword(request.getPassword());
        newUser.setAuthority("USER");
        userRepository.save(newUser);


        Customer customer = new Customer();
        customer.setUser(newUser);
        customerRepository.save(customer);

        response.put("success", true);
        response.put("message", "Customer registered successfully");
        return response;
    }
}
