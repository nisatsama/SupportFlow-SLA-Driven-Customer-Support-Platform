package helpdesk.in.HelpDeskTicketManagementSystem.controller;

import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Status.UpdateTicketStatusRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.CreateTicketRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.TicketResponseDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<TicketResponseDto> createTicket(
            @Valid @RequestBody CreateTicketRequestDto createTicketRequestDto,
            Authentication authentication
    ) {

        String email = authentication.getName();

        TicketResponseDto createdTicket =
                ticketService.registerTicket(
                        createTicketRequestDto,
                        email
                );

        return new ResponseEntity<>(
                createdTicket,
                HttpStatus.CREATED
        );
    }

    // GET TICKETS
    // ADMIN -> ALL TICKETS
    // USER  -> ONLY THEIR OWN TICKETS
    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> getTickets(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                ticketService.getTicketsForUser(email)
        );
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicket(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                ticketService.getTicketForUser(id, email)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponseDto> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody CreateTicketRequestDto updateRequest,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                ticketService.updateTicket(
                        id,
                        updateRequest,
                        email
                )
        );
    }

    // HARD DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email = authentication.getName();

        ticketService.deleteTicket(id, email);

        return ResponseEntity.noContent().build();
    }

    // SOFT DELETE
    @PatchMapping("/{id}/soft-delete")
    public ResponseEntity<Void> softDeleteTicket(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email = authentication.getName();

        ticketService.softDeleteTicket(id, email);

        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/{ticketId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDto> updateStatus(
            @PathVariable Long ticketId,
            @Valid @RequestBody UpdateTicketStatusRequestDto request
    ) {
        TicketResponseDto response = ticketService.updateStatus(
                ticketId,
                request.getStatus()

        );

        return ResponseEntity.ok(response);
    }
}