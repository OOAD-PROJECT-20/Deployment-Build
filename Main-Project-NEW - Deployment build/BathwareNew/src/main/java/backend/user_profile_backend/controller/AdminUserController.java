package backend.user_profile_backend.controller;

import backend.user_profile_backend.dto.CombinedUserResponse;
import backend.user_profile_backend.dto.UserSearchRequest;
import backend.user_profile_backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users") // base path
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<CombinedUserResponse>> listAll() {
        return ResponseEntity.ok(userService.search(null, null, null)); // fetch all
    }

    @GetMapping("/search")
    public ResponseEntity<List<CombinedUserResponse>> search(
            @RequestParam(required=false) String name,
            @RequestParam(required=false) String email,
            @RequestParam(required=false) String telephone
    ) {
        return ResponseEntity.ok(userService.search(name, email, telephone));
    }

    @PostMapping("/search")
    public ResponseEntity<List<CombinedUserResponse>> searchPost(@RequestBody UserSearchRequest req) {
        return ResponseEntity.ok(userService.search(req.getName(), req.getEmail(), req.getTelephone()));
    }
}
