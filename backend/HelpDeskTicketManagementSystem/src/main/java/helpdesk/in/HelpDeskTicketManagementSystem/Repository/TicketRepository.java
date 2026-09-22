package helpdesk.in.HelpDeskTicketManagementSystem.Repository;

import helpdesk.in.HelpDeskTicketManagementSystem.Entity.Ticket;
import helpdesk.in.HelpDeskTicketManagementSystem.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findAllByDeletedFalse();

    List<Ticket> findByCreatedByAndDeletedFalse(User createdBy);

    Optional<Ticket> findByIdAndDeletedFalse(Long id);

    Optional<Ticket> findByIdAndCreatedByAndDeletedFalse(
            Long id,
            User createdBy
    );
}