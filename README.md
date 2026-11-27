# 🍕 Pizza Delivery Application

A full-stack pizza ordering and delivery web application featuring a customer storefront, an admin dashboard, and a backend API.

## 📁 Project Structure

* **`/frontend`** – Customer-facing web app to browse the menu, customize orders, and checkout.
* **`/admin`** – Admin dashboard to manage menu items, track live orders, and update delivery status.
* **`/backend`** – REST API, database models, and authentication logic.

## 📖 Detailed Documentation

For specific setup instructions, features, and environment variables, check the individual guides:
* [Frontend Documentation](./frontend/README.md)
* [Admin Panel Documentation](./admin/README.md)

## 🛠️ Tech Stack

* **Frontend & Admin:** React.js, CSS / Tailwind
* **Backend:** Node.js, Express.js
* **Database:** MongoDB

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sachin-Yadav-789/Pizza-Delivery.git
   cd Pizza-Delivery
   ```

2. **Install dependencies and run each service:**
   * Open separate terminals in `backend`, `frontend`, and `admin`, then run:
   ```bash
   npm install
   npm run server # backend
   npm run dev    # frontend and admin
   ```
