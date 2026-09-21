
        package helpdesk.in.HelpDeskTicketManagementSystem.controller;

import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Authentication.AuthResponseDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Authentication.LoginRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Authentication.RegisterRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(
            @Valid @RequestBody RegisterRequestDto request) {

        AuthResponseDto response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @Valid @RequestBody LoginRequestDto request) {

        AuthResponseDto response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}
