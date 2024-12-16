# Contribution Guide for Storedash Backend Services

Welcome to the Storedash Backend Services project! This project uses a **monorepo** structure to manage multiple microservices in one repository. This guide explains the structure and provides instructions for contributing to the project.

## What is a Monorepo?

A **monorepo** (short for "monolithic repository") is a single repository that contains multiple projects or services. In our case, this monorepo contains backend microservices such as:

- **auth-service**: Handles user authentication and authorization
- **order-service**: Manages order processing and tracking
- **inventory-service**: Tracks inventory levels and updates

This approach helps us:

- Share code and dependencies between services
- Manage services and scripts centrally
- Simplify collaboration and versioning

## Project Structure

```
storedash-backend-services/
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   ├── order-service/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   ├── inventory-service/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
├── package.json
├── pnpm-workspace.yaml
└── ...
```

Key directories:

- **services/**: Contains all microservices
- **package.json**: Root configuration for managing the monorepo
- **pnpm-workspace.yaml**: Configures pnpm to treat each service as a workspace

## Setting Up the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/storedash-backend-services.git
cd storedash-backend-services
```

### 2. Install Dependencies

We use `pnpm` as the package manager. Install it globally if you don't already have it:

```bash
npm install -g pnpm
```

Then install all dependencies:

```bash
pnpm install
```

### 3. Running Services

You can run all services in parallel or a specific service.

#### Run All Services:

```bash
pnpm run dev:all
```

#### Run a Specific Service:

```bash
# Auth Service
pnpm run dev:auth

# Order Service
pnpm run dev:order

# Inventory Service
pnpm run dev:inventory
```

### Debugging Services

To list all services in the monorepo:

```bash
pnpm run debug:list-services
```

This command will show all detected services and their dependencies.

## Adding a New Service

1. Create a new folder in `services/` with the name of your service.

2. Add a `package.json` file with the following structure:

```json
{
  "name": "<service-name>",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

3. Add your service's code in a `src/` folder.

4. The service will be automatically included due to the `pnpm-workspace.yaml` configuration.

5. Install dependencies:

```bash
pnpm install
```

6. Start the service:

```bash
pnpm run service:dev <service-name>
```

## Code Formatting

We use **Prettier** for consistent code formatting. Before committing, run:

```bash
pnpm prettier --write .
```

## Contributing

1. Fork the repository
2. Create a feature branch:

```bash
git checkout -b feature/<your-feature>
```

3. Commit your changes and push to your fork
4. Open a pull request against the main branch

## Best Practices

- Keep services loosely coupled
- Use shared packages in the `shared/` directory for common utilities
- Write comprehensive tests for each service
- Follow the established code formatting guidelines

## Getting Help

For questions or help, reach out to the project maintainers or open an issue on the repository.

**Happy coding!**
