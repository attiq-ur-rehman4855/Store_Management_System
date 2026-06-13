# 🏪 Store Management System  

A comprehensive **Full-Stack Store Management System** built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). This system follows a strict **MVC (Model-View-Controller) architecture** to manage products, track sales, and authenticate users efficiently.

---

## 🚀 Features
- **User Authentication:** Secure Signup, Login, and Protected Routes.
- **Product Management:** Full CRUD operations to add, update, view, and delete store products.
- **Sales Tracking:** Keep a record of daily sales transactions.
- **Clean Architecture:** Strict separation of concerns using the MVC pattern.
- **Responsive UI:** Modern dashboard design built with React and custom styling.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, Axios, React Router Dom
- **Backend:** Node.js, Express.js, Mongoose (MongoDB ODM)
- **Database:** MongoDB Atlas (Cloud)

---

## 📂 Project Structure
```text
Store_Management_System/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic (Auth, Products, Sales)
│   ├── middleware/      # Authentication verifications
│   ├── models/          # Database Schemas (User, Product, Sale)
│   ├── routes/          # API Endpoints
│   └── server.js        # Main Entry point
└── frontend/
    ├── public/
    └── src/
        ├── api/         # Axios instance setup
        ├── components/  # Reusable UI components (Sidebar, etc.)
        ├── context/     # Auth Global State Management
        ├── pages/       # Dashboard, Products, Sales, Login, Signup
        └── main.jsx

```

---

## 💻 Installation & Setup

If you want to run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone [https://github.com/attiq-ur-rehman4855/Store_Management_System.git](https://github.com/attiq-ur-rehman4855/Store_Management_System.git)
cd Store_Management_System

```

### 2. Setup Backend

```bash
cd backend
npm install

```

Create a `.env` file in the `backend/` folder and add your connection string:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_secret_key

```

Start backend server:

```bash
npm start

```

### 3. Setup Frontend

Open a new terminal, go to frontend folder:

```bash
cd ../frontend
npm install
npm run dev

```

---

## 👨‍💻 Author

* **Attiq Ur Rehman** - [GitHub Profile](https://github.com/attiq-ur-rehman4855)

```
