# Database Schema

## Users
- name
- email (unique)
- password
- role (admin/customer)
- businessId (indexed)

## Businesses
- name
- ownerId
- subdomain (unique)

## Meals
- name
- price
- macros
- category
- businessId

## Orders
- items
- customerId
- businessId
- status
- deliveryDate

## Subscriptions
- customerId
- businessId
- mealsPerWeek
- deliveryDays
- nextBillingDate
- status

## WebsiteConfig
- businessId
- theme
- template
- colors
- logo
- banners