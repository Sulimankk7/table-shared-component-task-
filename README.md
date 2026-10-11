# Shared Dynamic DataTable

## Project Overview

A simple project built with Vue 3 for the frontend and Node.js + Express for the backend.

The goal is to create a reusable table that can display different types of data, such as users and products, without creating a separate table for each one.

## How to Run

```bash
# Backend -> http://localhost:3000
cd backend
npm install
npm run dev

# Frontend -> http://localhost:5173
cd frontend
npm install
npm run dev
```

## Frontend

- **Shared DataTable:** A reusable component that displays data based on the columns and data passed to it.
- **Dynamic Columns:** Each page can define its own columns.
- **Search and Filtering:** Users can search through the data and filter by specific columns.
- **Actions:** The table has an `actions` slot. Each page decides which buttons to show (for example Edit and Delete). The Actions column appears only when a page uses the slot, so Products has no Actions column.
- **Services:** Separate services for users and products organize data operations and keep API calls out of the page components.
- **CSS:** Used only to improve the visual appearance, including buttons, forms, colors, spacing, and responsive layouts.

## Backend

The backend uses Node.js and Express.

- **Router:** Directs incoming requests to the correct endpoint.
- **Controller:** Handles requests and coordinates the response.
- **Service:** Contains the logic for data operations.
- **JSON Files:** Store the project data without requiring a database.

## Main Principles

- **DRY:** Avoids repeating table and API request logic.
- **Single Responsibility:** Each part has a clear responsibility.
- **List Abstraction:** The table displays different lists without depending on a specific data type.
- **Reusability:** The same table can be used across different pages.

## Main Benefits

- Reusable and configurable table.
- Clear separation between frontend and backend responsibilities.
- Easier maintenance and future improvements.
