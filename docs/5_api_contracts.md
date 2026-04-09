# API Contracts

## Auth
POST /auth/register
POST /auth/login

## Meals
POST /meals
GET /meals

## Orders
POST /orders
GET /orders

## Subscriptions
POST /subscriptions
PUT /subscriptions/:id/pause

## Website Config
GET /website-config/:businessId
PUT /website-config