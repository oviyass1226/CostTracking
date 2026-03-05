# API Documentation

## Authentication
- **POST /api/auth/register**
  - Body: `{ username, email, password }`
- **POST /api/auth/login**
  - Body: `{ email, password }`

## Expenses
- **GET /api/expenses**
  - Headers: `Authorization: Bearer <token>`
- **POST /api/expenses**
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ amount, description, date, category_id }`
- **GET /api/expenses/monthly?month=MM&year=YYYY**
  - Headers: `Authorization: Bearer <token>`
- **GET /api/expenses/category-summary?month=MM&year=YYYY**
  - Headers: `Authorization: Bearer <token>`
- **DELETE /api/expenses/:id**
  - Headers: `Authorization: Bearer <token>`

## Budgets
- **GET /api/budget?month=MM&year=YYYY** (also /api/budgets)
  - Headers: `Authorization: Bearer <token>`
- **POST /api/budget** (also /api/budgets)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ category_id, amount, month, year }`
- **DELETE /api/budget/:id** (also /api/budgets)
  - Headers: `Authorization: Bearer <token>`

## Categories
- **GET /api/categories**
  - Headers: `Authorization: Bearer <token>`
- **POST /api/categories**
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name, type }`
