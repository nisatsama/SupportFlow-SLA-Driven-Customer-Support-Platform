package helpdesk.in.HelpDeskTicketManagementSystem.Entity;

import helpdesk.in.HelpDeskTicketManagementSystem.Model.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(nullable = false,length = 100)
private String name;

@Column(nullable = false,unique = true,length=150)
private String email;

@Column(nullable = false,length=60)
private String password;

@Enumerated(EnumType.STRING)
@Column(nullable = false,length = 20)
private UserRole role = UserRole.USER;

private Boolean enabled=true;

@OneToMany(mappedBy = "createdBy",fetch=FetchType.LAZY)
private List<Ticket> createdTickets = new ArrayList<>();

@OneToMany(mappedBy = "assignedTo", fetch = FetchType.LAZY)
private List<Ticket> assignedTickets = new ArrayList<>();

@CreationTimestamp
@Column(nullable = false,updatable = false)
private LocalDateTime createdAt;

@UpdateTimestamp
@Column(nullable = false)
private LocalDateTime updatedAt;
}
