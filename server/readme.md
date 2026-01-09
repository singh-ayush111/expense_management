# Expense Management Tool

A full-stack web application designed to help users track personal expenses, categorize spending, and set budget limits. It features secure user authentication, real-time budget alerts, and an intuitive dashboard.

## Features

* **User Authentication:** Secure registration and login using JWT (JSON Web Tokens).
* **Expense Tracking:** Add, view, and delete daily expenses with categories (Food, Transport, etc.).
* **Budget Management:** Set monthly spending limits for specific categories.
* **Smart Alerts:** Visual warning banners if an added expense exceeds the set budget.
* **Dashboard Summary:** Real-time view of total spending and transaction counts.
* **Responsive Design:** Clean, grid-based UI that works on desktop and mobile.

## Tech Stack

### Frontend
* **HTML5 & CSS3:** For structure and styling (Grid/Flexbox).
* **Vanilla JavaScript:** For DOM manipulation and API integration (Fetch API).

### Backend
* **Node.js:** Runtime environment.
* **Express.js:** Web framework for handling routes and middleware.
* **MongoDB & Mongoose:** NoSQL database for storing users, expenses, and budgets.
* **JWT & Bcrypt:** For secure authentication and password hashing.

---

## Project Structure

```text
expense-tracker/
├── server/                 # Backend Node/Express API
│   ├── models/             # Mongoose Models (User, Expense, Budget)
│   ├── routes/             # API Endpoints
│   ├── middleware/         # Auth verification
│   ├── .env                # Environment variables
│   └── server.js           # Entry point
│
└── client/                 # Frontend Static Files
    ├── index.html          # Login Page
    ├── dashboard.html      # Main Application
    ├── style.css           # Styling
    └── script.js           # Frontend Logic