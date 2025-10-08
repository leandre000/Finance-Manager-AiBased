# FIMA Backend (NestJS)

## Prerequisites
- Node.js 20+
- Docker & Docker Compose

## Setup
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install deps:
   ```bash
   npm install
   ```
3. Run services (from repo root):
   ```bash
   docker compose up -d postgres rabbitmq minio
   ```
4. Start backend (inside `backend/`):
   ```bash
   npm run start:dev
   ```

## Health Check
- GET `http://localhost:3000/api/health`

## Scripts
- `npm run build` – build TypeScript
- `npm run start` – run compiled app
- `npm run start:dev` – dev mode with reload
- `npm run lint` – lint code
- `npm run format` – format code
