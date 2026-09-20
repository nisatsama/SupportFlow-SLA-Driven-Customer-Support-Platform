package helpdesk.in.HelpDeskTicketManagementSystem.Repository;

import helpdesk.in.HelpDeskTicketManagementSystem.Entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket,Long> {
}
