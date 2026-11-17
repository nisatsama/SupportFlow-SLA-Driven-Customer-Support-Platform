
package helpdesk.in.HelpDeskTicketManagementSystem.config;

import helpdesk.in.HelpDeskTicketManagementSystem.Entity.User;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.UserRole;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            Environment environment
    ) {
        return args -> {
            String email = environment.getProperty("ADMIN_EMAIL");
            String password = environment.getProperty("ADMIN_PASSWORD");

            // Do not create a default administrator account.
            if (!StringUtils.hasText(email)
                    || !StringUtils.hasText(password)) {
                System.out.println(
                        "Admin bootstrap skipped: credentials not configured."
                );
                return;
            }

            // Never overwrite an existing administrator's password.
            if (userRepository.findByEmail(email).isPresent()) {
                System.out.println("Admin account already exists.");
                return;
            }

            User admin = new User();
            admin.setName(
                    environment.getProperty("ADMIN_NAME", "System Admin")
            );
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole(UserRole.ADMIN);

            userRepository.save(admin);

            System.out.println("Initial administrator account created.");
        };
    }
}
