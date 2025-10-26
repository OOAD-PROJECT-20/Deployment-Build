package backend.user_profile_backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductImageController {

    @Value("${product.images.dir:frontend/public/images}")
    private String imagesDir;

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }

            // Get the original filename
            String originalFilename = file.getOriginalFilename();
            
            System.out.println("DEBUG: Images directory: " + imagesDir);
            
            // Create directory if it doesn't exist
            File imageFolder = new File(imagesDir);
            if (!imageFolder.exists()) {
                System.out.println("DEBUG: Creating images directory: " + imagesDir);
                boolean created = imageFolder.mkdirs();
                System.out.println("DEBUG: Directory created: " + created);
            } else {
                System.out.println("DEBUG: Directory already exists");
            }

            // Save the file
            String filePath = imagesDir + File.separator + originalFilename;
            System.out.println("DEBUG: Full file path: " + filePath);
            File dest = new File(filePath);
            
            // List files before save
            System.out.println("DEBUG: Files in directory BEFORE save:");
            File[] filesBefore = imageFolder.listFiles();
            if (filesBefore != null) {
                for (File f : filesBefore) {
                    System.out.println("  - " + f.getName());
                }
            }
            
            file.transferTo(dest);
            System.out.println("DEBUG: File saved successfully!");
            System.out.println("DEBUG: File exists after save: " + dest.exists());
            System.out.println("DEBUG: File absolute path: " + dest.getAbsolutePath());
            System.out.println("DEBUG: File size: " + dest.length() + " bytes");
            System.out.println("DEBUG: Can read: " + dest.canRead());
            System.out.println("DEBUG: Can write: " + dest.canWrite());
            
            // List files after save
            System.out.println("DEBUG: Files in directory AFTER save:");
            File[] filesAfter = imageFolder.listFiles();
            if (filesAfter != null) {
                for (File f : filesAfter) {
                    System.out.println("  - " + f.getName() + " (" + f.length() + " bytes)");
                }
            }

            // Return the URL that will be used in the database
            String imageUrl = "/images/" + originalFilename;
            
            return ResponseEntity.ok().body(new ImageUploadResponse(imageUrl, "File uploaded successfully"));
        } catch (IOException e) {
            System.err.println("ERROR: Failed to upload file!");
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        }
    }

    // Response DTO
    public static class ImageUploadResponse {
        private String imageUrl;
        private String message;

        public ImageUploadResponse(String imageUrl, String message) {
            this.imageUrl = imageUrl;
            this.message = message;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}

