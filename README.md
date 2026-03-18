# ShopSmart

ShopSmart is a modern, responsive, and elegant e-commerce application designed with a premium, sleek aesthetic. 
The project features a full-stack architecture with a React frontend, Node.js/Express backend, and a SQLite database.

## Architecture

The project is structured as a monorepo with three main components:

1. **Client (Frontend)**: 
   - Built with React and Vite.
   - Uses Context API for global state management (Auth, Cart, Wishlist).
   - Styled with plain CSS using custom properties for theming, ensuring a lightweight and performant UI.
   - Icons are provided by Lucide React.
   - Designed to mimic a high-end "Dribbble" style aesthetic with smooth transitions and glassmorphism elements.

2. **Backend (Server)**:
   - Built with Node.js and Express.
   - Uses Prisma as the ORM to interact with a SQLite database.
   - Secures API endpoints with JWT-based authentication.
   - Handles products and user data.

3. **E2E Tests**:
   - Built with Playwright.
   - Covers key user workflows: authentication, shopping cart management, navigation, and product interactions.

## Design Decisions

- **Why SQLite + Prisma?** 
  SQLite was chosen for its zero-configuration setup and portability, making the project easy to deploy and run locally without needing a separate database server. Prisma provides a type-safe, developer-friendly ORM that integrates seamlessly with SQLite.

- **Why Context API instead of Redux?**
  For an application of this scale, Context API (paired with `useReducer` or standard state) offers sufficient state management capabilities without the boilerplate of Redux. It manages the cart, wishlist, and user authentication seamlessly across the app.

- **Vanilla CSS vs Tailwind/CSS-in-JS**:
  To demonstrate a deep understanding of CSS fundamentals and to keep dependencies light, the project utilizes plain CSS with extensive use of CSS Custom Properties (Variables) for theming, typography, spacing, and animations.

## Workflow & Deployment

- **CI/CD Pipeline**: GitHub Actions are configured to automate the testing, linting, and deployment processes.
  - The CI workflow (`ci.yml`) runs unit/integration tests and linting for both frontend and backend, as well as Playwright E2E tests.
  - The CD workflow (`deploy.yml`) is set up to automatically deploy changes to an AWS EC2 instance.

- **Local Setup**:
  To simplify local development, automated Bash scripts (`create-db.sh`, `run.sh`) handle dependency installation, database seeding, and concurrent server startup.

## Challenges

- **Migration from MongoDB to Prisma/SQLite**: The project originally contained Mongoose schemas, which were fully migrated to Prisma. Managing the schema and resolving field mismatches (e.g., `_id` vs `id`) required careful auditing.
- **E2E Testing Environments**: Ensuring the Vite dev server spins up dynamically and correctly proxies to the actual Node backend during headless E2E runs required configuring Playwright's `webServer` option correctly.
