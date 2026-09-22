package helpdesk.in.HelpDeskTicketManagementSystem.Dto.Message;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMessageRequestDto {

    @NotBlank(message = "Message cannot be empty")
    private String message;
}