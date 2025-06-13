# Task Manager

A full-stack web application that allows authenticated users to create, edit and remove tasks.

## Tech Stack
- Backend: Go (Gin, GORM)
- Frontend: React, TypeScript
- Proxy: Node, Express, TypeScript
- Database: Postgres
- Authentication: JWT
- Deployment: Docker, Docker-Compose

## Prerequisites
- Docker, Docker-Compose installed
- Git installed
- Method for generating RSA key (`openssl` works)

## Build And Deploy Instructions
1. Clone this repository:
   ```bash
   git clone https://github.com/dawsonamarkham/task-manager.git
   ```
2. Enter `task-manager` directory:
   ```bash
   cd task-manager
   ```
3. Generate a RSA PEM encoded key with `openssl` or another source:
   ```bash
   openssl genrsa 1024
   ```
   Note: 1024 bits is the minimum allowed by the server. Some online generators provide keys that are too short and this will cause the backend server to fail.
4. Copy generated key into `server.env`. Replace `PLACE_RSA_SECRET_HERE` for the variable `PLACE_RSA_SECRET_HERE`.
   The Secret Key must be PEM encoded, so `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` must be included along with their associated new line characters.

   In `server.env`:
   ```
   SECRET_KEY="-----BEGIN PRIVATE KEY-----
   ...
   -----END PRIVATE KEY-----"
   ```
5. Build and deploy the containers:
   ```bash
   docker compose up -d
   ```
   After a few minutes, the containers should be built and running. You can check with:
   ```bash
   docker container ls
   ```
   There should be 3 containers: the postgres container, the server container (Go backend) and the web container (Node proxy and React app)
   The server containe is expected to restart a few times initially due to the postgres container spending time initializing.

## React App
- The React app can be reached at [http://localhost:3000](http://localhost:3000). A Sign In form should load.
- If no account has been made, there is an option to `Create Account`. After completing either form, the user will be authenticated via a JWT for 10 minutes.
- While authorized, the user can create, view, edit and delete tasks via cards and modals. The app will periodically update and check authorization.
- After logging out (via the button on the top right of the page) or losing authorization, the user will be taken back to the Sign In form.

## Go Backend
- The Go server can also be accessed via the proxy at [http://localhost:3000](http://localhost:3000) with endpoints beginning with `/auth` and `/rest`.
- A short description of each endpoint:
  - `POST /auth/signup` - Takes a valid unique email and a password between the length of 8 and 72 and returns a JWT.
  - `POST /auth/signin` - Takes an email and password and validates against existing users and returns a JWT.
  - `POST /auth/signout` - Performs no action on the server side. The client should forget the JWT.
  - `POST /rest/tasks` - Creates a task with Title, Description(?), Category and Completion status.
  - `GET /rest/tasks?limit=&page=&categoryFilter&=completionFilter` - Retrieve a paginated list of tasks with filters for Category and Completion.
  - `GET /rest/tasks/:id` - Retrieves a specified task by ID.
  - `PUT /rest/tasks/:id` - Updates Title, Description, Category and Completion of specified task.
  - `DELETE /rest/tasks/:id` - Hard deletes specified task.
- Valid Categories are `Work`, `Personal`, `Hobby` and `Other`.

   
