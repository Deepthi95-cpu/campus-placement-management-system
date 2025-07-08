# 🎓 Campus Placement Management System

A full-stack web application to manage student placement records with AI-powered resume reviews and mock interviews.

---

## 🚀 Features

- 🔐 Secure login/registration (JWT-based auth)
- 📝 Add / update / delete / search student records
- 📎 Resume upload + LinkedIn/GitHub profile links
- 🤖 AI-Powered Resume Review and Mock Interview using Gemini API
- 💬 Feedback submission from students
- 🧑‍💻 Admin panel

---

## 🛠 Tech Stack

| Layer     | Technology                 |
|-----------|----------------------------|
| Frontend  | Angular                    |
| Backend   | Node.js + Express          |
| Database  | MySQL                      |
| AI APIs   | Gemini AI API (via Google) |
| Auth      | JWT + Nodemailer           |

---

## 🧩 Local Setup Guide

Follow these steps to run the project locally:

---

### ✅ 1. Clone the repository

```bash
git clone https://github.com/Deepthi95-cpu/campus-placement-management-system.git
cd campus-placement-management-system
```

---

### ✅ 2. Setup the Backend API

```bash
cd Api-Backend
npm install
```

Create a `.env` file in the root of **Api-Backend** folder:

```env
PORT=3100
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=Campus_Connect
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
GEMINI_API_KEY=your_gemini_api_key
```

---

### ✅ 3. Configure MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS Campus_Connect;
USE Campus_Connect;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  branch VARCHAR(50),
  year VARCHAR(50),
  company_name VARCHAR(255),
  employee_type VARCHAR(255),
  image TEXT,
  linkedin VARCHAR(255),
  github VARCHAR(255),
  resume VARCHAR(255),
  user_id INT UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### ✅ 4. Start Backend Server

```bash
npm start
```

> Backend runs on: [http://localhost:3100](http://localhost:3100)

---

### ✅ 5. Setup Frontend Angular App

```bash
cd ../Client-Frontend
npm install
ng serve
```

> Frontend runs on: [http://localhost:4200](http://localhost:4200)

---

## 🔗 API Endpoints (Examples)

### 🔐 Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/request-password-reset`
- `POST /api/auth/reset-password`

### 🎓 Students
- `GET /api/students/getall`
- `POST /api/students/add`
- `PUT /api/students/update/:id`
- `DELETE /api/students/delete/:id`

### 🧠 Gemini AI
- `POST /gemini/generate-content`

### 💬 Feedback
- `POST /api/feedbacks`
- `GET /api/feedbacks`

---

## 📁 Folder Structure

```
Campus Placement Management System/
├── Api-Backend/
│   ├── controllers/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   └── server.js
├── Client-Frontend/
│   └── src/app/Components/
```

---

## 👨‍💻 Contributors

- [@Deepthi95-cpu](https://github.com/Deepthi95-cpu)
- [@vineetajaiswal](https://github.com/vineetajaiswal)

---

## 🪪 License

Licensed under the [MIT License](LICENSE).

---

