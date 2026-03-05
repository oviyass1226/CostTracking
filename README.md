# Cost Tracking App

A full-stack application for tracking expenses, managing budgets, and viewing financial reports.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS (optional/custom styles)
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## Prerequisites
- Node.js (v14+)
- MySQL Server

## Setup Instructions

### 1. Database Setup
1.  Ensure MySQL is running.
2.  Create the database using the provided SQL script:
    ```bash
    mysql -u root -p < database/schema.sql
    ```
    (Or copy the contents of `database/schema.sql` and run it in your MySQL client).

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Open `.env` file.
    - Update `DB_USER` and `DB_PASSWORD` with your MySQL credentials.
4.  Start the server:
    ```bash
    npm run dev
    ```
    Server runs on `http://localhost:5000`.

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    App runs on `http://localhost:5173`.

## Usage
1.  Register a new account.
2.  Login with your credentials.
3.  Add Categories (e.g., Food, Transport).
4.  Add Expenses.
5.  Set Budgets for categories.
6.  View Dashboard and Reports.
