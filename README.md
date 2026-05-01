# ceres-app-starline

Starline is a calm, daily space-and-sky app project.
This repository is organized for MVP-first development.

## Tech Stack

- Backend: Java 17, Spring Boot 3, PostgreSQL
- Frontend: React (Web) with TypeScript + Vite
- API: REST

## Repository Structure

- `backend`: Spring Boot API server
- `frontend`: React Web app
- `structure.txt`: project structure policy
- `starlineFeatureRequestFile.txt`: feature requests
- `DevelopmentPolicy.txt`: development principles
- `codingRules.txt`: naming and coding rules

## Getting Started

### 1) Backend

Requirements:
- Java 17
- Maven 3.9+
- PostgreSQL 14+

Run:

```bash
cd backend
mvn spring-boot:run
```

Health endpoint:
- `GET http://localhost:8080/api/health`
- `GET http://localhost:8080/api/today-space-history`

Environment variables:
- `DB_URL` (default: `jdbc:postgresql://localhost:5432/starline`)
- `DB_USERNAME` (default: `postgres`)
- `DB_PASSWORD` (default: `postgres`)
- `SERVER_PORT` (default: `8080`)

### 2) Frontend (Web)

Requirements:
- Node.js 20+
- npm 10+

Run:

```bash
cd frontend
npm install
npm run dev
```

Optional environment variable:
- `VITE_API_BASE_URL` (default: `http://localhost:8080`)

## MVP Build Order

1. Today in Space History (API + cache + web display)
2. Daily sky-check record
3. Tonight visible stars (weather/moon integration)

## Implemented in this phase

- Backend endpoint `GET /api/today-space-history`
- Backend endpoint `GET /api/sky-check/today`
- Backend endpoint `POST /api/sky-check/today`
- Wikipedia On This Day fetch (space keyword filter)
- Daily DB cache in `today_space_histories` table
- Frontend home card connected to backend API
- Daily sky-check record and streak display on frontend
