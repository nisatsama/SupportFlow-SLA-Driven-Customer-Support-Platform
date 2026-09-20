package helpdesk.in.HelpDeskTicketManagementSystem.controller;

import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.CreateTicketRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.TicketResponseDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @Valid @RequestBody CreateTicketRequestDto createTicketRequestDto
    ) {

        // Temporary until Spring Security authentication is implemented
        Long userId = 1L;

        TicketResponseDto createdTicket =
                ticketService.registerTicket(createTicketRequestDto, userId);

        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> getAllTickets() {

        return ResponseEntity.ok(
                ticketService.getAllTickets()
        );
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicket(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ticketService.getTicket(id)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponseDto> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody CreateTicketRequestDto updateRequest
    ) {

        return ResponseEntity.ok(
                ticketService.updateTicket(id, updateRequest)
        );
    }

    // HARD DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id
    ) {

        ticketService.deleteTicket(id);

        return ResponseEntity.noContent().build();
    }

    // SOFT DELETE
    @PatchMapping("/{id}/soft-delete")
    public ResponseEntity<Void> softDeleteTicket(
            @PathVariable Long id
    ) {

        ticketService.softDeleteTicket(id);

        return ResponseEntity.noContent().build();
    }
}
