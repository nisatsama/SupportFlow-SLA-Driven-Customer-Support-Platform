package helpdesk.in.HelpDeskTicketManagementSystem.config;

import helpdesk.in.HelpDeskTicketManagementSystem.Entity.User;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.UserRole;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            User admin = userRepository
                    .findByEmail("admin@helpdesk.com")
                    .orElseGet(User::new);

            admin.setName("System Admin");
            admin.setEmail("admin@helpdesk.com");
            admin.setPassword(
                    passwordEncoder.encode("admin123")
            );
            admin.setRole(UserRole.ADMIN);

            userRepository.save(admin);

            System.out.println(
                    "Admin account ready: admin@helpdesk.com"
            );
        };
    }
}