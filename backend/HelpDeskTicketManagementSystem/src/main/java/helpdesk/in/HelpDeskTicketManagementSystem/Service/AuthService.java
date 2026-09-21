
        package helpdesk.in.HelpDeskTicketManagementSystem.Service;

import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Authentication.AuthResponseDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Authentication.LoginRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Authentication.RegisterRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Entity.User;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.UserRole;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponseDto register(RegisterRequestDto request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .enabled(true)
                .build();

        // Save user to database
        User savedUser = userRepository.save(user);

        // Generate JWT for the newly registered user
        String token = jwtService.generateToken(savedUser);

        // Return JWT + user information
        return AuthResponseDto.builder()
                .token(token)
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    public AuthResponseDto login(LoginRequestDto request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        // Check if account is enabled
        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT
        String token = jwtService.generateToken(user);

        // Return JWT + user information
        return AuthResponseDto.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
