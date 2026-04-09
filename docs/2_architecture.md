# Architecture

## Type
Monolithic backend (MVP)

## Tech Stack
- Backend: Node.js + Express
- Frontend: React
- DB: MongoDB
- Payments: Stripe

## Layers
Controller → Service → Model

## Modules
- Auth
- Business
- Meals
- Orders
- Subscriptions
- WebsiteConfig

## Request Flow
Frontend → API → Backend → DB → Response