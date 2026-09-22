package helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket;

import helpdesk.in.HelpDeskTicketManagementSystem.Model.TicketPriority;
import helpdesk.in.HelpDeskTicketManagementSystem.Model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponseDto {

    private Long id;

    private String title;

    private String description;

    private TicketStatus status;

    private TicketPriority priority;

    private String category;

    private Long createdById;

    private String createdByName;

    private LocalDateTime deadline;

    private String imageUrl;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Integer roomNo;
}