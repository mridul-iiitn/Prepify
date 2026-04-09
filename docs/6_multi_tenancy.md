# Multi-Tenancy

## Rule
Every entity MUST include businessId

## Enforcement
- All queries must filter by businessId
- No cross-business access

## Example
Meal.find({ businessId })

## Risk
If ignored → data leakage (critical bug)