# Docker

## Production image

The production image builds the Vite frontend first, then runs the Express backend. The backend serves the generated frontend when `NODE_ENV=production`.

1. Create the runtime environment file:

   ```powershell
   Copy-Item backend\.env.example backend\.env
   ```

2. Set `MONGO_URI`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` in `backend/.env`.

3. Build and start the application:

   ```powershell
   docker compose up --build -d
   ```

4. Open `http://localhost:5001`.

Stop the application with:

```powershell
docker compose down
```

The application uses the external MongoDB and Upstash services configured in `backend/.env`; Compose does not create database or Redis containers.

## Flask API

The repository also includes a Flask + PyMongo implementation with the same `/api/notes` CRUD contract. It is optional and does not start with the default Node service:

```powershell
docker compose --profile flask up --build -d flask-api
```

The Flask API is available at `http://localhost:5002`, with health checks at `http://localhost:5002/health`. It reads `MONGO_URI` and optional `MONGO_DB` from `backend/.env`.

## Authentication

The Node API exposes:

- `POST /api/auth/register` with `{ "email": "...", "password": "..." }`
- `POST /api/auth/login` with the same body
- `GET /api/auth/me` with `Authorization: Bearer <token>`

All `/api/notes` endpoints require a valid JWT. Configure `JWT_SECRET` with a long random value and optionally set `JWT_EXPIRES_IN` in `backend/.env` before deployment.
