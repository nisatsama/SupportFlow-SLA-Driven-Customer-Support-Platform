package helpdesk.in.HelpDeskTicketManagementSystem.Service;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.CreateTicketRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.TicketResponseDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Entity.Ticket;
import helpdesk.in.HelpDeskTicketManagementSystem.Entity.User;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.TicketPriority;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.TicketStatus;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.UserRole;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.TicketRepository;
import helpdesk.in.HelpDeskTicketManagementSystem.Repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('USER')")
    public TicketResponseDto registerTicket(
            CreateTicketRequestDto createTicketRequestDto,
            String email
    ) {
        User creator = userRepository.findByEmail(email)
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
        ticket.setImageUrl(
                createTicketRequestDto.getImageUrl()
        );
        ticket.setRoomNo(
                createTicketRequestDto.getRoomNo()
        );
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedBy(creator);
        ticket.setDeleted(false);
        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToResponseDto(savedTicket);
    }


    public TicketResponseDto updateTicket(
            Long id,
            CreateTicketRequestDto updateRequest,
            String email
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );
        Ticket ticket = ticketRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket not found with id: " + id
                        )
                );
        boolean isPrivileged =
                user.getRole() == UserRole.ADMIN;

        boolean isOwner =
                ticket.getCreatedBy() != null &&
                        ticket.getCreatedBy()
                                .getId()
                                .equals(user.getId());

        if (!isPrivileged && !isOwner) {
            throw new RuntimeException(
                    "You are not allowed to update this ticket."
            );
        }

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

        if (updateRequest.getImageUrl() != null) {
            ticket.setImageUrl(
                    updateRequest.getImageUrl()
            );
        }


        ticket.setRoomNo(
                updateRequest.getRoomNo()
        );

        Ticket updatedTicket =
                ticketRepository.save(ticket);

        return mapToResponseDto(updatedTicket);
    }

    public void deleteTicket(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        Ticket ticket = ticketRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket not found with id: " + id
                        )
                );

        boolean isPrivileged =
                user.getRole() == UserRole.ADMIN ;

        boolean isOwner =
                ticket.getCreatedBy() != null &&
                        ticket.getCreatedBy()
                                .getId()
                                .equals(user.getId());

        if (!isPrivileged && !isOwner) {
            throw new RuntimeException(
                    "You are not allowed to delete this ticket."
            );
        }

        ticketRepository.delete(ticket);
    }
    public List<TicketResponseDto> getTicketsForUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        List<Ticket> tickets;

        if (user.getRole() == UserRole.ADMIN) {

            // ADMIN sees all non-deleted tickets
            tickets = ticketRepository.findAllByDeletedFalse();

        } else {

            // USER sees only tickets created by themselves
            tickets = ticketRepository
                    .findByCreatedByAndDeletedFalse(user);
        }

        return tickets.stream()
                .map(this::mapToResponseDto)
                .toList();
    }
    public TicketResponseDto getTicketForUser(
            Long id,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        Ticket ticket = ticketRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket not found with id: " + id
                        )
                );

        boolean isPrivileged =
                user.getRole() == UserRole.ADMIN ;

        boolean isOwner =
                ticket.getCreatedBy() != null &&
                        ticket.getCreatedBy()
                                .getId()
                                .equals(user.getId());

        if (!isPrivileged && !isOwner) {
            throw new RuntimeException(
                    "You are not allowed to access this ticket."
            );
        }

        return mapToResponseDto(ticket);
    }

    public void softDeleteTicket(
            Long id,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        Ticket ticket = ticketRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket not found with id: " + id
                        )
                );

        boolean isPrivileged =
                user.getRole() == UserRole.ADMIN;

        boolean isOwner =
                ticket.getCreatedBy() != null &&
                        ticket.getCreatedBy()
                                .getId()
                                .equals(user.getId());

        if (!isPrivileged && !isOwner) {
            throw new RuntimeException(
                    "You are not allowed to delete this ticket."
            );
        }

        ticket.setDeleted(true);

        ticketRepository.save(ticket);
    }



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


                ticket.getDeadline(),

                // Image URL
                ticket.getImageUrl(),

                // Created At
                ticket.getCreatedAt(),

                // Updated At
                ticket.getUpdatedAt(),

                ticket.getRoomNo()
        );
    }
    public TicketResponseDto updateStatus(
            Long ticketId,
            TicketStatus status
    ) {
        Ticket ticket = ticketRepository
                .findByIdAndDeletedFalse(ticketId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket not found with id: " + ticketId
                        )
                );

        ticket.setStatus(status);

        Ticket updatedTicket = ticketRepository.save(ticket);

        return mapToResponseDto(updatedTicket);
    }
}
