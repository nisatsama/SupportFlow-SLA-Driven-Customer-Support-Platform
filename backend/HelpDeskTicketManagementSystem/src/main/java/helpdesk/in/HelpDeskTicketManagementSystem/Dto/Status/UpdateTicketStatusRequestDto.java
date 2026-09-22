package helpdesk.in.HelpDeskTicketManagementSystem.Dto.Status;

import helpdesk.in.HelpDeskTicketManagementSystem.Model.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTicketStatusRequestDto {
    @NotNull
    private TicketStatus status;
}
