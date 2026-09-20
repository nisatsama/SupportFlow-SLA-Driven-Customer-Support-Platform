package helpdesk.in.HelpDeskTicketManagementSystem.Dto.Ticket;

import helpdesk.in.HelpDeskTicketManagementSystem.Model.TicketPriority;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateTicketRequestDto {
    @NotBlank(message="Title is required")
    @Size(max = 150,message="Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private TicketPriority priority;

    @Size(max=50,message="Category cannot exceed 50 characters")
    private String category;

    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDateTime deadline;
}
