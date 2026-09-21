package helpdesk.in.HelpDeskTicketManagementSystem.Dto.Authentication;


import helpdesk.in.HelpDeskTicketManagementSystem.Model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AuthResponseDto {
private Long id;
private String name;
private String email;
private UserRole role;
    private String token;
    private String tokenType;
}