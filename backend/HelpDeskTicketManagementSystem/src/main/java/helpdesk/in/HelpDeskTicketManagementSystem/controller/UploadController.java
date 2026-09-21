package helpdesk.in.HelpDeskTicketManagementSystem.controller;

import helpdesk.in.HelpDeskTicketManagementSystem.Service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity
                    .badRequest()
                    .body("Image must be smaller than 5 MB");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/webp"))) {

            return ResponseEntity
                    .badRequest()
                    .body("Only JPG, PNG and WEBP images are allowed");
        }

        String imageUrl = cloudinaryService.uploadImage(file);

        return ResponseEntity.ok(imageUrl);
    }
}