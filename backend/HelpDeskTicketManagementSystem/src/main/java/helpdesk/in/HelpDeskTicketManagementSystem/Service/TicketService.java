package helpdesk.in.HelpDeskTicketManagementSystem.Service;

import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.CreateTicketRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.TicketResponseDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Entity.Ticket;
import helpdesk.in.HelpDeskTicketManagementSystem.Entity.User;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.TicketPriority;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.TicketStatus;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.TicketRepository;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }


    // =========================
    // CREATE
    // =========================

    public TicketResponseDto registerTicket(
            CreateTicketRequestDto createTicketRequestDto,
            Long userId
    ) {

        User creator = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        Ticket ticket = new Ticket();

        ticket.setTitle(createTicketRequestDto.getTitle());

        ticket.setDescription(
                createTicketRequestDto.getDescription()
        );

        ticket.setPriority(
                createTicketRequestDto.getPriority() != null
                        ? createTicketRequestDto.getPriority()
                        : TicketPriority.MEDIUM
        );

        ticket.setCategory(
                createTicketRequestDto.getCategory()
        );

        ticket.setDeadline(
                createTicketRequestDto.getDeadline()
        );

        ticket.setStatus(TicketStatus.OPEN);

        ticket.setCreatedBy(creator);

        // New tickets are initially unassigned
        ticket.setAssignedTo(null);

        // Important for soft delete
        ticket.setDeleted(false);

        Ticket savedTicket = ticketRepository.save(ticket);

        return mapToResponseDto(savedTicket);
    }


    // =========================
    // GET ALL
    // =========================

    public List<TicketResponseDto> getAllTickets() {

        return ticketRepository.findAllByDeletedFalse()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // =========================
    // GET BY ID
    // =========================

    public TicketResponseDto getTicket(Long id) {

        Ticket ticket = ticketRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found with id: " + id)
                );

        return mapToResponseDto(ticket);
    }


    // =========================
    // UPDATE
    // =========================

    public TicketResponseDto updateTicket(
            Long id,
            CreateTicketRequestDto updateRequest
    ) {

        Ticket ticket = ticketRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found with id: " + id)
                );

        ticket.setTitle(updateRequest.getTitle());

        ticket.setDescription(
                updateRequest.getDescription()
        );

        if (updateRequest.getPriority() != null) {
            ticket.setPriority(
                    updateRequest.getPriority()
            );
        }

        ticket.setCategory(
                updateRequest.getCategory()
        );

        ticket.setDeadline(
                updateRequest.getDeadline()
        );

        Ticket updatedTicket = ticketRepository.save(ticket);

        return mapToResponseDto(updatedTicket);
    }


    // =========================
    // HARD DELETE
    // =========================

    public void deleteTicket(Long id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found with id: " + id)
                );

        ticketRepository.delete(ticket);
    }


    // =========================
    // SOFT DELETE
    // =========================

    public void softDeleteTicket(Long id) {

        Ticket ticket = ticketRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found with id: " + id)
                );

        ticket.setDeleted(true);

        ticketRepository.save(ticket);
    }


    // =========================
    // DTO MAPPER
    // =========================

    private TicketResponseDto mapToResponseDto(Ticket ticket) {

        return new TicketResponseDto(

                ticket.getId(),

                ticket.getTitle(),

                ticket.getDescription(),

                ticket.getStatus(),

                ticket.getPriority(),

                ticket.getCategory(),

                // Created By
                ticket.getCreatedBy() != null
                        ? ticket.getCreatedBy().getId()
                        : null,

                ticket.getCreatedBy() != null
                        ? ticket.getCreatedBy().getName()
                        : null,

                // Assigned To
                ticket.getAssignedTo() != null
                        ? ticket.getAssignedTo().getId()
                        : null,

                ticket.getAssignedTo() != null
                        ? ticket.getAssignedTo().getName()
                        : null,

                ticket.getDeadline(),

                ticket.getCreatedAt(),

                ticket.getUpdatedAt()
        );
    }
}
