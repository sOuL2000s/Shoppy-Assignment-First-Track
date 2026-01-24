# 🚀 Shoppy V2: Production-Grade E-commerce Platform

## Project Overview

Shoppy V2 is a demonstration of a secure, scalable, full-stack e-commerce system developed as a coding assessment project. It supports role-based access control (Customer and Seller) and leverages advanced caching techniques (Redis) for performance, and transactional integrity (MySQL/Sequelize) for financial operations (Checkout).

## 🛠️ Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React.js (CRA), Tailwind CSS, Context API | Modern, component-based UI, utility-first styling for speed. |
| **Backend** | Node.js, Express.js | Fast, non-blocking API layer with service-layer architecture. |
| **Database** | MySQL (via Sequelize ORM) | Relational integrity for Users, Orders, and Products. |
| **Caching/Queue**| Redis | High-speed storage for volatile data: OTP verification and Customer Carts. |
| **Authentication**| JWT, Bcrypt | Secure, stateless authentication with Role-Based Access Control (RBAC). |
| **Deployment** | Netlify (FE), Render (BE) | Optimized for modern CI/CD workflows and cost-efficiency. |
| **CI/CD** | GitHub Actions | Automated build and deployment pipeline integration. |

## 📂 Project Structure

```
shoppy-backend/
├── config/
│   ├── db.config.js       # MySQL connection parameters
│   └── redis.config.js    # Redis connection setup
├── controllers/           # HTTP Request handlers
├── middleware/
│   ├── authJwt.js         # JWT verification & RBAC
│   └── validation.js      # Input sanitation and schema checks
├── models/                # Sequelize schema definitions and associations (MVC Model)
├── routes/                # API route definitions
├── services/              # Business Logic (e.g., Auth, Cart, Checkout transactions)
├── utils/
│   ├── email.js           # Nodemailer integration
│   └── response.js        # Standardized API response format
├── .env.example
├── server.js              # Entry point
└── package.json

shoppy-frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axiosInstance.js # JWT interceptor setup
│   ├── components/        # Reusable UI elements
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx  # Handles Redis Cart interaction
│   └── pages/             # Route-specific views (Dashboards, Auth)
├── .env.example
├── package.json
└── tailwind.config.js
```

## 💻 Local Setup Instructions

### Prerequisites

1.  Node.js (v18+) & npm
2.  MySQL Server (Local or Docker)
3.  Redis Server (Local or Docker)

### 1. Backend Setup (`shoppy-backend/`)

1.  **Install Dependencies:**
    ```bash
    cd shoppy-backend
    npm install
    ```
2.  **Configuration:**
    Create a `.env` file from `.env.example`.
    -   Configure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
    -   Configure `REDIS_URL`.
    -   Configure `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` (use **Ethereal** for testing if you don't have a service).
3.  **Run Migrations & Start:**
    The `server.js` automatically performs `db.sequelize.sync()`, creating all necessary tables.
    ```bash
    npm run dev
    # API runs on http://localhost:8080
    ```

### 2. Frontend Setup (`shoppy-frontend/`)

1.  **Install Dependencies:**
    ```bash
    cd shoppy-frontend
    npm install
    ```
2.  **Configuration:**
    Create a `.env` file from `.env.example`, ensuring the API URL is correct:
    ```
    REACT_APP_API_URL=http://localhost:8080/api
    ```
3.  **Start Application:**
    ```bash
    npm start
    # App runs on http://localhost:3000
    ```

## 🌐 API Endpoints Documentation

All endpoints are prefixed with `/api`.

### 1. Authentication (Public)

| Method | Path | Description | Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register a new user (`customer` or `seller`). Sends OTP. | Public |
| `POST` | `/auth/verify-otp` | Verify OTP sent to email. | Public |
| `POST` | `/auth/login` | Login user, returns JWT token. | Public |

### 2. Products (Public & Seller)

| Method | Path | Description | Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | List all products with `stock > 0`. | Public |
| `POST` | `/seller/products` | Create a new product. | Seller |
| `PUT` | `/seller/products/:id` | Update product details (stock, price, etc.). | Seller |

### 3. Cart & Checkout (Customer Only)

| Method | Path | Description | Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/customer/cart` | Retrieve current cart items from Redis. | Customer |
| `POST` | `/customer/cart` | Add item/quantity to the cart. | Customer |
| `POST` | `/customer/checkout` | Finalize order (transactional DB update & stock decrement, clear Redis cart). | Customer |

### 4. Orders (Customer Only)

| Method | Path | Description | Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/customer/orders` | View previous purchase history. | Customer |


Websites : 

https://shoppy-simple-ecommerce-website.netlify.app/
https://shoppy-assignment-first-track.onrender.com/