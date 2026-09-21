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

            if (userRepository.findByEmail("admin@helpdesk.com").isEmpty()) {

                User admin = new User();

                admin.setName("System Admin");
                admin.setEmail("admin@helpdesk.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(UserRole.ADMIN);

                userRepository.save(admin);
            }

            if (userRepository.findByEmail("agent@helpdesk.com").isEmpty()) {

                User agent = new User();

                agent.setName("Support Agent");
                agent.setEmail("agent@helpdesk.com");
                agent.setPassword(passwordEncoder.encode("agent123"));
                agent.setRole(UserRole.AGENT);

                userRepository.save(agent);
            }
        };
    }
}