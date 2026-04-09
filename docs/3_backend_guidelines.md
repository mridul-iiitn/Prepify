# Backend Guidelines

## Folder Responsibilities

### controllers/
- Handle request/response
- No business logic

### services/
- All business logic

### models/
- DB schemas only

### routes/
- API routes

### middleware/
- Auth, error handling

## Rules
- Use async/await
- Validate inputs
- Handle errors properly