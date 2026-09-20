package helpdesk.in.HelpDeskTicketManagementSystem.Repository;

import helpdesk.in.HelpDeskTicketManagementSystem.Entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findAllByDeletedFalse();

    Optional<Ticket> findByIdAndDeletedFalse(Long id);
}
