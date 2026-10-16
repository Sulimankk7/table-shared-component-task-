# Shared Dynamic DataTable

## Project Overview

A simple project built with Vue 3 for the frontend and Node.js + Express for the backend.

The goal is to create a reusable table that can display different types of data, such as users and products, without creating a separate table for each one.

## Frontend

- **Shared DataTable:** A reusable component that displays data based on the columns and data passed to it.
- **Dynamic Columns:** Each page can define its own columns.
- **Search and Filtering:** Users can search through the data and filter by specific columns.
- **Actions:** A Boolean property controls whether the Edit and Delete buttons are shown or hidden.
- **Services:** Separate services for users and products organize data operations and keep API calls out of the page components.
- **CSS:** Used only to improve the visual appearance, including buttons, forms, colors, spacing, and responsive layouts.


## Backend

The backend uses Node.js, Express, and PostgreSQL.

- **Routes:** Define API endpoints and direct requests to controllers.
- **Controllers:** Handle HTTP requests, validate basic request requirements, and return responses.
- **DataManager:** Coordinates data operations and selects the appropriate repository through the repository factory.
- **RepositoryFactory:** Provides the repository associated with each supported resource.
- **Repositories:** Handle database queries and CRUD operations using PostgreSQL.
- **Database Configuration:** Creates the PostgreSQL connection pool using environment variables.
- **Dependency Injection:** Dependencies are passed between layers instead of being created inside each layer.

## Database

- PostgreSQL is the primary source of truth.
- The `users` and `products` tables store application data.
- Database credentials are configured through the backend `.env` file.
- The `.env` file must not be committed to version control.

## Main Principles

- **DRY:** Reuse common logic and avoid unnecessary duplication.
- **SOLID:** Separate responsibilities and keep components focused.
- **Repository Pattern:** Separate database access from application logic.
- **Dependency Injection:** Pass dependencies to the components that need them.
- **Factory Pattern:** Centralize the selection of repositories.
- **List Abstraction:** The shared table displays different datasets through configurable columns and data.

## Main Benefits

- Reusable and configurable table.
- Clear separation between frontend and backend responsibilities.
- Easier maintenance and future improvements.
