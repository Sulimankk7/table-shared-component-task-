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



