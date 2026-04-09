# Subscription Engine

## Flow
1. User subscribes
2. Stripe payment
3. Store subscription
4. Cron job:
   - Check billing date
   - Generate orders
   - Charge again

## Edge Cases
- Payment failure
- Pause subscription