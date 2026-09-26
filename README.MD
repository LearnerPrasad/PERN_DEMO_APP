# PERN App

A learning project using PostgreSQL, Express, React, and Node.js.

## Stack

- Client: React, TypeScript, Vite
- Server: Express, TypeScript
- Database: PostgreSQL (`pg`)

## Requirements

Install Node.js and npm once on your computer, and make sure PostgreSQL is running. Install each app's npm packages separately from its folder.

## Run Locally

Create `server/.env` with your local database settings:

```env
DB_USER=postgres
DB_NAME=your_database_name
DB_PORT=5432
DB_HOST=localhost
DB_PASSWORD=your_postgres_password
```

Do not commit `.env`; it contains local credentials and is ignored by Git.

In one terminal, start the backend:

```bash
cd server
npm install
npm run dev
```

In another terminal, start the frontend:

```bash
cd client
npm install
npm run dev
```

Vite prints the frontend URL. The Express backend listens on port `3000`.

## Frontend and Backend

The frontend and backend are separate programs. The frontend connects by making HTTP requests to backend API routes. For example, frontend code can request the current `GET /db-test` route like this:

```ts
const response = await fetch('http://localhost:3000/db-test');
const users = await response.json();
```

The backend route queries PostgreSQL and sends the result back as JSON. The Vite starter page does not make this request yet. Since the frontend and backend use different local ports, configure backend CORS or a Vite development proxy before calling the API from the browser.

`/db-test` currently runs `SELECT * FROM users`; the configured database must already have a `users` table. The route has no authentication and returns all user rows, so use it only for local development, not with real user data or in a public deployment. This project does not yet include database schema or migration files.
