# SmartOffice Management System

A full-stack Microservices project for managing office resources, featuring JWT authentication, RBAC, and containerized deployment with Docker.

## How to Run and Test
1. Make sure you have **Docker Desktop** installed.
2. Clone this repository.
3. Open a terminal in the project root folder.
4. Run the following command:
   ```bash
   docker compose up --build

Once the containers are running:

Frontend: http://localhost:3000
Identity API (PostgreSQL): http://localhost:5201/swagger
Resource API (MongoDB): http://localhost:5298/swagger

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Reflections & Challenges:

During development, I encountered several technical bottlenecks:

Docker Networking: Initially, services couldn't connect to databases using localhost. I solved this by using Docker's internal DNS (service names) and injecting connection strings via environment variables.

JWT Authorization (401 Errors): Syncing the security keys and audiences between the Auth service and the Resource service was a challenge. I resolved it by centralizing the JWT validation logic and ensuring the Admin role was correctly included in the token claims.

Full Stack Integration: Ensuring the React frontend correctly sends the Bearer token in headers and handles the response.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Tooling Disclosure:

AI-Powered Development: 

- Cursor (AI Code Editor): Used as the primary IDE for rapid prototyping, intelligent code completion, and refactoring backend/frontend components.
- Gemini (Google): Assisted in debugging complex Docker networking issues, architectural consulting for Microservices, and refining the JWT authentication flow.

Frameworks: .NET 9 (C#), React (TypeScript), MongoDB, PostgreSQL, Docker Compose.

