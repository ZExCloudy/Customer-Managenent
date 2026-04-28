# Customer Management System

A full-stack web application to manage customer records. Built with **React + Vite** on the frontend and **Node.js + Express** on the backend.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Backend API](#backend-api)
- [Frontend Details](#frontend-details)
- [How Each Feature Works](#how-each-feature-works)

---

## Overview

The Customer Management System is a CRUD (Create, Read, Update, Delete) application that allows users to:

- Add new customers with their name, email, and phone number
- View all customers in a paginated table
- Search customers in real-time by any field
- Delete customers from the list
- See the exact date and time each customer was added

The frontend communicates with the backend via REST API calls using the browser's native `fetch` API.

---

## Tech Stack

| Layer     | Technology              | Version  |
|-----------|-------------------------|----------|
| Frontend  | React                   | 18.2.0   |
| Frontend  | Vite                    | 4.4.5    |
| Frontend  | CSS (custom, no library)| —        |
| Backend   | Node.js                 | —        |
| Backend   | Express                 | 5.2.1    |
| Backend   | CORS middleware         | 2.8.6    |

---

## Project Structure

```
Customer-Managenent/
│
├── Backend/
│   ├── index.js          # Express server — all API routes
│   ├── package.json      # Backend dependencies
│   └── package-lock.json
│
├── Front End/
│   ├── src/
│   │   ├── App.jsx       # Main React component — all UI and logic
│   │   ├── App.css       # All styles including responsive breakpoints
│   │   └── main.jsx      # React entry point
│   ├── public/
│   ├── index.html
│   ├── vite.config.js    # Vite config with proxy to backend
│   ├── package.json      # Frontend dependencies
│   └── package-lock.json
│
└── README.md
```

---

## Features

### Add Customer
- A form at the top of the page accepts Full Name, Email Address, and Phone Number
- Inline validation runs before submission:
  - Email must match a valid format (e.g. `user@example.com`)
  - Phone must be exactly 10 digits
  - Error messages appear below the relevant field in real time
- On successful submission the form clears and the table refreshes instantly

### Phone Number Formatting
- As the user types in the phone field, digits are automatically formatted as `XXXX-XXX-XXX`
- Only digits are accepted — letters and symbols are stripped automatically
- The raw 10-digit number is stored in state and sent to the backend; the formatted version is only for display

### View Customers
- All customers are displayed in a clean table with columns: `#`, `Name`, `Email`, `Phone`, `Added At`, `Action`
- Each row shows an avatar circle with the customer's initial
- The `Added At` column shows the full local date and time the record was created

### Live Search
- A search bar above the table filters records instantly on every keystroke
- Matches against Name, Email, and Phone simultaneously
- Matched characters are highlighted in yellow (`mark.highlight`) inside the table cells
- Clearing the search input restores the full list automatically
- The 🔍 Search button resets the pagination back to page 1

### Pagination
- The table shows 5 records per page
- Numbered page buttons let the user jump to any page directly
- Prev / Next buttons navigate one page at a time and disable automatically at the boundaries
- Pagination resets to page 1 whenever the search input changes

### Delete Customer
- Each row has a 🗑 Delete button
- Clicking it sends a `DELETE` request to the backend and refreshes the table

### Responsive Design
- **Desktop (> 640px):** Fixed vertical sidebar on the left, form fields in a row, search bar inline with the table title
- **Tablet (≤ 900px):** Reduced padding and font sizes, fields shrink gracefully
- **Mobile (≤ 640px):**
  - Sidebar hides off-screen and slides in via a ☰ hamburger button
  - A dark overlay appears behind the open sidebar; tapping it closes the menu
  - A sticky mobile header replaces the desktop topbar
  - Form fields stack vertically, full width
  - Search bar and button stack below the table title
  - Table scrolls horizontally so no columns are lost on small screens
  - Pagination buttons wrap and shrink for small viewports

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed (v16 or higher recommended)
- A terminal / command prompt

### 1. Clone or download the project

```
git clone <repository-url>
cd Customer-Managenent
```

### 2. Install Backend dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend dependencies

```bash
cd "Front End"
npm install
```

### 4. Run the Backend

```bash
cd Backend
node index.js
```

The server starts at: `http://localhost:5000`

### 5. Run the Frontend

Open a **second terminal**:

```bash
cd "Front End"
npm run dev
```

The app opens at: `http://localhost:5173`

> The Vite dev server proxies all `/customers` requests to `http://localhost:5000` automatically, so no CORS issues occur during development.

---

## Backend API

Base URL: `http://localhost:5000`

All request and response bodies use `Content-Type: application/json`.

### `GET /customers`

Returns the full list of all customers.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9879890890",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### `POST /customers`

Creates a new customer record.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9879890890"
}
```

**Response `201 Created`:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9879890890",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### `DELETE /customers/:id`

Deletes the customer with the given `id`.

**Response `204 No Content`** — empty body on success.

---

> **Note:** The backend uses an in-memory array to store customers. Data is lost when the server restarts. To persist data, integrate a database such as MongoDB, PostgreSQL, or SQLite.

---

## Frontend Details

### State Variables (`App.jsx`)

| State       | Type    | Purpose                                              |
|-------------|---------|------------------------------------------------------|
| `customers` | Array   | Full list of customers fetched from the backend      |
| `form`      | Object  | Controlled input values for the Add Customer form    |
| `errors`    | Object  | Validation error messages for email and phone fields |
| `search`    | String  | Current value of the search input                    |
| `page`      | Number  | Current active page number for pagination            |
| `menuOpen`  | Boolean | Controls whether the mobile sidebar is open          |

### Key Functions

| Function        | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| `validate()`    | Checks email format and phone length, returns an errors object              |
| `formatPhone()` | Converts raw digits to `XXXX-XXX-XXX` display format                       |
| `fetchCustomers()` | Calls `GET /customers` and updates the `customers` state               |
| `handleSubmit()` | Validates the form, posts to the backend, resets the form, refreshes list |
| `handleDelete()` | Sends `DELETE /customers/:id`, then refreshes the list                   |
| `highlight()`   | Splits a string by the search term and wraps matches in a `<mark>` tag     |

### Derived Values

| Variable      | Description                                                        |
|---------------|--------------------------------------------------------------------|
| `filtered`    | `customers` filtered by the current `search` value                 |
| `totalPages`  | Total number of pages based on `filtered.length` and `PAGE_SIZE`   |
| `paginated`   | The slice of `filtered` records shown on the current page          |

---

## How Each Feature Works

### Live Search + Highlight

Every keystroke updates the `search` state. The `filtered` array is recomputed on every render by running `Array.filter()` against all three fields. The `highlight()` function uses a case-insensitive `RegExp` to split each cell's text into parts, wrapping matched parts in `<mark className="highlight">` elements which are styled with a yellow background in CSS.

### Phone Formatting

The `onChange` handler strips all non-digit characters and slices to 10 digits before storing in state. The `formatPhone()` function is only called at render time to display the value — the raw digits are what get sent to the backend.

### Pagination

`PAGE_SIZE` is set to `5`. `totalPages` is `Math.ceil(filtered.length / PAGE_SIZE)`. The `paginated` slice uses `(page - 1) * PAGE_SIZE` as the start index. Any time `search` changes, `page` resets to `1` so the user always sees results from the beginning.

### Responsive Sidebar

On mobile the sidebar has `transform: translateX(-100%)` by default, hiding it off-screen. Adding the `open` class sets `transform: translateX(0)`, sliding it in. A semi-transparent overlay div is rendered on top of the main content when `menuOpen` is true, and clicking it closes the sidebar.
