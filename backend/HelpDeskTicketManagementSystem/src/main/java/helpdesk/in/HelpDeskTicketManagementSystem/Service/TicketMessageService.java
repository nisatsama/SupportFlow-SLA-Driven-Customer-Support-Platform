package helpdesk.in.HelpDeskTicketManagementSystem.Service;

import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Message.CreateMessageRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.TicketMessage.TicketMessageResponseDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Entity.Ticket;
import helpdesk.in.HelpDeskTicketManagementSystem.Entity.TicketMessage;
import helpdesk.in.HelpDeskTicketManagementSystem.Entity.User;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.TicketStatus;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.TicketMessageRepository;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.TicketRepository;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketMessageService {

    private final TicketMessageRepository ticketMessageRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketMessageService(
            TicketMessageRepository ticketMessageRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository
    ) {
        this.ticketMessageRepository = ticketMessageRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public List<TicketMessageResponseDto> getMessages(
            Long ticketId,
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        // USER can only view messages of their own ticket
        if (user.getRole().name().equals("USER")
                && !ticket.getCreatedBy().getId().equals(user.getId())) {

            throw new RuntimeException("You are not allowed to view this ticket");
        }

        return ticketMessageRepository
                .findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public TicketMessageResponseDto sendMessage(
            Long ticketId,
            CreateMessageRequestDto request,
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        // USER can only message on their own ticket
        if (user.getRole().name().equals("USER")
                && !ticket.getCreatedBy().getId().equals(user.getId())) {

            throw new RuntimeException("You are not allowed to message on this ticket");
        }
        if (user.getRole().name().equals("USER")
                && ticket.getStatus().name().equals("RESOLVED")) {

            ticket.setStatus(TicketStatus.OPEN);
            ticketRepository.save(ticket);
        }
        TicketMessage message = new TicketMessage();

        message.setTicket(ticket);
        message.setSender(user);
        message.setMessage(request.getMessage());

        TicketMessage savedMessage =
                ticketMessageRepository.save(message);

        return convertToDto(savedMessage);
    }

    private User getAuthenticatedUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    private TicketMessageResponseDto convertToDto(
            TicketMessage message
    ) {

        return new TicketMessageResponseDto(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getName(),
                message.getSender().getRole().name(),
                message.getMessage(),
                message.getCreatedAt()
        );
    }
}