# 🚀 Job Application Tracking System

A full-stack web application designed to help users efficiently **manage, organize, and track their job applications** from a centralized dashboard.

## ✨ Features

* 🔐 **User Authentication** — Secure login and registration using JWT.
* ➕ **Job Management** — Add, edit, and delete job applications.
* 📊 **Application Dashboard** — View application statistics by status.
* 🔍 **Search** — Search applications by company or position.
* 🎯 **Status Filtering** — Filter applications by Applied, Interview, Offer, or Rejected.
* ↕️ **Sorting** — Sort applications by newest, oldest, or company name.
* 📝 **Notes** — Add notes and reminders to individual applications.
* 📅 **Application & Interview Dates** — Track important dates for each application.
* 🔔 **Toast Notifications** — Get instant feedback for successful and failed actions.
* 📱 **Responsive UI** — Designed to work across desktop and mobile screens.

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* React Router
* Axios
* Bootstrap
* React Icons
* React Toastify

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

### Database

* PostgreSQL
* Prisma ORM

### Tools

* Git
* GitHub
* VS Code

## 🏗️ Project Structure

```text
Job-Application-Tracker/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── middleware/
│   ├── index.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Job-Application-Tracker
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` folder:

```env
DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_jwt_secret"
PORT=5000
```

### 5. Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 6. Start the backend

```bash
npm run dev
```

### 7. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

The backend will normally run on:

```text
http://localhost:5000
```

## 🔄 Application Workflow

```text
User Registration/Login
        ↓
JWT Authentication
        ↓
Dashboard
        ↓
Add Job Application
        ↓
Store Data in PostgreSQL
        ↓
Search / Filter / Sort
        ↓
Edit / Delete Application
        ↓
Track Application Status
```

## 📌 Job Information

Each application can contain:

* Company name
* Job position
* Application status
* Application date
* Interview date
* Personal notes

Supported statuses:

```text
Applied
Interview
Offer
Rejected
```

## 🔒 Security

* JWT-based authentication
* Protected job-management routes
* User-specific job data
* Password authentication
* Environment variables for sensitive configuration

## 🎯 Future Improvements

* Email reminders for upcoming interviews
* Application analytics and charts
* Resume/document attachment
* Job application deadlines
* Dark mode
* Export applications as CSV/PDF

## 👩‍💻 Author

**Anjali Pawar**

Built as a full-stack project to demonstrate practical experience with **React, Node.js, Express, PostgreSQL, Prisma, REST APIs, and authentication**.
