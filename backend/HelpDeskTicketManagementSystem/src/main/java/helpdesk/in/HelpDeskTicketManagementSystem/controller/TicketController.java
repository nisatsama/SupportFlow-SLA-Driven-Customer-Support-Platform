package helpdesk.in.HelpDeskTicketManagementSystem.controller;

import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.CreateTicketRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket.TicketResponseDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

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
}
