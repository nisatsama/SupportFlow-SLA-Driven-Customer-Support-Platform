package helpdesk.in.HelpDeskTicketManagementSystem.Dto.Authentication;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponseDto {

    private String token;
    private String tokenType;
}