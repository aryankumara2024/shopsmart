# ShopSmart

ShopSmart is a full-stack e-commerce application with a React frontend, an Express backend, Prisma ORM, SQLite database, authentication, testing, and CI/CD workflows.

## Features

- User authentication with JWT
- Product browsing and shopping flow
- Responsive React UI
- Backend API using Express
- Prisma ORM with SQLite
- Unit, integration, and end-to-end tests
- GitHub Actions CI
- Dependabot automation
- Deployment workflow support

## Tech Stack

### Frontend
- React
- Vite
- Context API
- CSS

### Backend
- Node.js
- Express
- Prisma
- SQLite
- JWT

### Testing
- Vitest / React Testing Library
- Backend API tests
- Playwright

### DevOps
- GitHub Actions
- Dependabot
- PM2 deployment workflow

## Project Structure

```text
shopsmart/
├── backend/
├── client/
├── e2e/
├── .github/
├── create-db.sh
├── run.sh
├── README.md
└── Project Rubric.md
```

## Prerequisites

- Node.js
- npm

## Setup

Run the setup script from the project root:

```bash
bash run.sh
```

This installs dependencies for both `backend` and `client`.

## Running the Project

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd client
npm run dev
```

## Testing

### Frontend tests
```bash
cd client
npm test
```

### Backend tests
```bash
cd backend
npm test
```

### End-to-end tests
```bash
npx playwright test
```

## Environment Variables

If your setup requires environment variables, configure them inside the relevant `.env` files for `backend` and `client`.

## CI/CD

This repository includes GitHub Actions workflows for:
- Build and lint checks
- Backend testing
- End-to-end testing
- Deployment automation

## Scripts

### `run.sh`
Checks prerequisites and installs dependencies for both apps.

### `create-db.sh`
Initializes the database setup.

## Notes

- The project uses a local SQLite database for development.
- Ensure all required npm scripts exist in both `backend` and `client`.
- If deployment settings change, update the documentation to keep it in sync.

## Author

ShopSmart project for Newton School.
