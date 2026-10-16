# Shared Dynamic DataTable

## Project Overview

A simple project built with Vue 3 for the frontend and Node.js + Express for the backend.

The goal is to create a reusable table that can display different types of data, such as users and products, without creating a separate table for each one.

The project has two versions:

- **JSON Version (`main`):** Stores data in JSON files.
- **PostgreSQL Version (`postgresql-version`):** Stores data in a PostgreSQL database.

## Frontend

- **Shared DataTable:** A reusable component that displays data based on the columns and data passed to it.
- **Dynamic Columns:** Each page can define its own columns.
- **Search and Filtering:** Users can search through the data and filter by specific columns.
- **Actions:** A Boolean property controls whether the Edit and Delete buttons are shown or hidden.
- **Services:** Separate services for users and products organize data operations and keep API calls out of the page components.
- **CSS:** Used to improve buttons, forms, colors, spacing, and responsive layouts.

## Backend

The backend uses Node.js and Express.

- **Routes:** Define API endpoints and direct requests to controllers.
- **Controllers:** Handle HTTP requests and return responses.
- **DataManager:** Coordinates data operations.
- **RepositoryFactory:** Selects the appropriate repository.
- **Repositories:** Handle database queries in the PostgreSQL version.
- **Dependency Injection:** Passes dependencies between layers instead of creating them inside each layer.

## Database

The PostgreSQL version uses PostgreSQL as the main data source.

- The `users` and `products` tables store application data.
- Database credentials are configured through the backend `.env` file.
- The `.env` file must not be committed to Git.

The JSON version uses JSON files instead of PostgreSQL.

## Main Principles

- **DRY:** Avoid unnecessary code duplication.
- **SOLID:** Separate responsibilities and keep components focused.
- **Repository Pattern:** Separate database access from application logic.
- **Dependency Injection:** Pass dependencies to the components that need them.
- **Factory Pattern:** Select the appropriate repository.
- **List Abstraction:** Display different datasets using configurable columns and data.

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/Sulimank7k7/table-shared-component-task-.git
cd table-shared-component-task-
```

### 2. Choose a Version

For the JSON version:

```bash
git switch main
```

For the PostgreSQL version:

```bash
git switch postgresql-version
```

### 3. Run the Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Run the Frontend

Open another terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

**Note:** The PostgreSQL version also requires PostgreSQL, the `shared_table_db` database, the `users` and `products` tables, and a configured backend `.env` file.

## Main Benefits

- Reusable and configurable table.
- Clear separation between frontend and backend responsibilities.
- Two implementations for comparing JSON storage and PostgreSQL.
- Easier maintenance and future improvements.
