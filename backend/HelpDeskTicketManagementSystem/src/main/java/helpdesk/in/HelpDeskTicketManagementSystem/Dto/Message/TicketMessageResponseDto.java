package helpdesk.in.HelpDeskTicketManagementSystem.Dto.TicketMessage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class TicketMessageResponseDto {

    private Long id;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String message;
    private LocalDateTime createdAt;
}