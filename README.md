
```
SE
├─ .idea
│  ├─ compiler.xml
│  ├─ encodings.xml
│  ├─ inspectionProfiles
│  │  └─ Project_Default.xml
│  ├─ jarRepositories.xml
│  ├─ misc.xml
│  ├─ modules.xml
│  ├─ SE.iml
│  ├─ vcs.xml
│  └─ workspace.xml
├─ backend
│  ├─ .idea
│  │  ├─ compiler.xml
│  │  ├─ encodings.xml
│  │  ├─ HelpDeskTicketManagementSystem (1).iml
│  │  ├─ jarRepositories.xml
│  │  ├─ misc.xml
│  │  ├─ modules.xml
│  │  └─ workspace.xml
│  └─ HelpDeskTicketManagementSystem
│     ├─ .mvn
│     │  └─ wrapper
│     │     └─ maven-wrapper.properties
│     ├─ HELP.md
│     ├─ mvnw
│     ├─ mvnw.cmd
│     ├─ pom.xml
│     ├─ src
│     │  ├─ main
│     │  │  ├─ java
│     │  │  │  └─ helpdesk
│     │  │  │     └─ in
│     │  │  │        └─ HelpDeskTicketManagementSystem
│     │  │  │           ├─ config
│     │  │  │           │  ├─ CorsConfig.java
│     │  │  │           │  └─ SecurityConfig.java
│     │  │  │           ├─ controller
│     │  │  │           │  ├─ AuthController.java
│     │  │  │           │  └─ TicketController.java
│     │  │  │           ├─ Dto
│     │  │  │           │  ├─ Assignment
│     │  │  │           │  │  └─ AssignTicketRequestDto.java
│     │  │  │           │  ├─ Authentication
│     │  │  │           │  │  ├─ AuthResponseDto.java
│     │  │  │           │  │  ├─ LoginRequestDto.java
│     │  │  │           │  │  └─ RegisterRequestDto.java
│     │  │  │           │  ├─ Status
│     │  │  │           │  │  └─ UpdateTicketStatusRequestDto.java
│     │  │  │           │  ├─ Ticket
│     │  │  │           │  │  ├─ CreateTicketRequestDto.java
│     │  │  │           │  │  ├─ TicketResponseDto.java
│     │  │  │           │  │  └─ UpdateResponseDto.java
│     │  │  │           │  └─ User
│     │  │  │           │     └─ UserResponseDto.java
│     │  │  │           ├─ Entity
│     │  │  │           │  ├─ Ticket.java
│     │  │  │           │  └─ User.java
│     │  │  │           ├─ HelpDeskTicketManagementSystemApplication.java
│     │  │  │           ├─ Model
│     │  │  │           │  ├─ TicketPriority.java
│     │  │  │           │  ├─ TicketStatus.java
│     │  │  │           │  └─ UserRole.java
│     │  │  │           ├─ Repository
│     │  │  │           │  ├─ TicketRepository.java
│     │  │  │           │  └─ UserRepository.java
│     │  │  │           └─ Service
│     │  │  │              ├─ AuthService.java
│     │  │  │              ├─ JwtService.java
│     │  │  │              ├─ TicketService.java
│     │  │  │              └─ UserService.java
│     │  │  └─ resources
│     │  │     ├─ application.properties
│     │  │     ├─ static
│     │  │     └─ templates
│     │  └─ test
│     │     └─ java
│     │        └─ helpdesk
│     │           └─ in
│     │              └─ HelpDeskTicketManagementSystem
│     │                 └─ HelpDeskTicketManagementSystemApplicationTests.java
│     └─ target
│        ├─ classes
│        │  ├─ application.properties
│        │  └─ helpdesk
│        │     └─ in
│        │        └─ HelpDeskTicketManagementSystem
│        │           ├─ config
│        │           │  ├─ CorsConfig.class
│        │           │  └─ SecurityConfig.class
│        │           ├─ controller
│        │           │  └─ TicketController.class
│        │           ├─ Dto
│        │           │  ├─ Assignment
│        │           │  │  └─ AssignTicketRequestDto.class
│        │           │  ├─ Authentication
│        │           │  │  ├─ AuthResponseDto.class
│        │           │  │  ├─ LoginRequestDto.class
│        │           │  │  └─ RegisterRequestDto.class
│        │           │  ├─ Status
│        │           │  │  └─ UpdateTicketStatusRequestDto.class
│        │           │  ├─ Ticket
│        │           │  │  ├─ CreateTicketRequestDto.class
│        │           │  │  ├─ TicketResponseDto.class
│        │           │  │  └─ UpdateResponseDto.class
│        │           │  └─ User
│        │           │     └─ UserResponseDto.class
│        │           ├─ Entity
│        │           │  ├─ Ticket.class
│        │           │  └─ User.class
│        │           ├─ HelpDeskTicketManagementSystemApplication.class
│        │           ├─ Model
│        │           │  ├─ TicketPriority.class
│        │           │  ├─ TicketStatus.class
│        │           │  └─ UserRole.class
│        │           ├─ Repository
│        │           │  ├─ TicketRepository.class
│        │           │  └─ UserRepository.class
│        │           └─ Service
│        │              ├─ TicketService.class
│        │              └─ UserService.class
│        ├─ generated-sources
│        │  └─ annotations
│        ├─ generated-test-sources
│        │  └─ test-annotations
│        └─ test-classes
│           └─ helpdesk
│              └─ in
│                 └─ HelpDeskTicketManagementSystem
│                    └─ HelpDeskTicketManagementSystemApplicationTests.class
└─ frontend
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  └─ vite.svg
   ├─ README.md
   ├─ src
   │  ├─ api
   │  │  └─ axios.js
   │  ├─ App.css
   │  ├─ App.jsx
   │  ├─ assets
   │  │  └─ react.svg
   │  ├─ components
   │  │  ├─ CreateTicketForm.jsx
   │  │  └─ TicketCard.jsx
   │  ├─ hooks
   │  ├─ index.css
   │  ├─ main.jsx
   │  ├─ pages
   │  │  └─ UserHome.jsx
   │  └─ services
   │     └─ ticketService.js
   └─ vite.config.js

```