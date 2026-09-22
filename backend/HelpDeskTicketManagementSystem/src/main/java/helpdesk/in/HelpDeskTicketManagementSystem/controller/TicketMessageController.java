package helpdesk.in.HelpDeskTicketManagementSystem.controller;

import helpdesk.in.HelpDeskTicketManagementSystem.Dto.Message.CreateMessageRequestDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Dto.TicketMessage.TicketMessageResponseDto;
import helpdesk.in.HelpDeskTicketManagementSystem.Service.TicketMessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin
public class TicketMessageController {

    private final TicketMessageService ticketMessageService;

    public TicketMessageController(
            TicketMessageService ticketMessageService
    ) {
        this.ticketMessageService = ticketMessageService;
    }

    @GetMapping("/{ticketId}/messages")
    public ResponseEntity<List<TicketMessageResponseDto>> getMessages(
            @PathVariable Long ticketId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                ticketMessageService.getMessages(
                        ticketId,
                        authentication
                )
        );
    }

    @PostMapping("/{ticketId}/messages")
    public ResponseEntity<TicketMessageResponseDto> sendMessage(
            @PathVariable Long ticketId,
            @Valid @RequestBody CreateMessageRequestDto request,
            Authentication authentication
    ) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ticketMessageService.sendMessage(
                                ticketId,
                                request,
                                authentication
                        )
                );
    }
}