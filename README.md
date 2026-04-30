# 🗂️ Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control. Built with React, Node.js, Express, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![MongoDB](https://img.shields.io/badge/database-MongoDB-brightgreen)

---

## 🌐 Live Demo

> Deployed on Railway: **[Add your Railway URL here after deployment]**

---

## ✨ Features

### 👑 Admin
- Create and delete projects
- Add and remove team members (by email)
- Create, edit, and delete tasks
- Assign tasks to members with due dates
- Full dashboard with all tasks across all projects
- View overdue tasks

### 👤 Member
- View projects they belong to
- View tasks assigned to them
- Update task status (`Todo → In Progress → Done`)
- Personal dashboard with task statistics

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas), Mongoose |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Deployment** | Railway |

---

## 📁 Project Structure

```
Team-Task-Manager/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, GetMe, GetUsers
│   │   ├── projectController.js   # CRUD for projects, member management
│   │   └── taskController.js      # CRUD for tasks, status updates
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── rbac.js                # Role-based access control
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password, role)
│   │   ├── Project.js             # Project schema (name, description, owner, members)
│   │   └── Task.js                # Task schema (title, status, assignees, dueDate)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js             # Axios instance with JWT interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx / Auth.css
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx / Dashboard.css
│   │   │   ├── Projects.jsx
│   │   │   └── ProjectDetail.jsx / ProjectDetail.css
│   │   ├── App.jsx                # Routing + Protected routes
│   │   ├── main.jsx
│   │   └── index.css              # Global design tokens & utilities
│   └── vite.config.js
│
└── package.json                   # Root scripts for Railway deployment
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js >= 18
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

### 2. Configure environment variables

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
PORT=5000
```

> **Note:** If your ISP blocks `mongodb+srv://` DNS resolution, use the explicit replica set connection string from MongoDB Atlas → Connect → Drivers.

### 3. Install dependencies & run

```bash
npm install
npm run dev
```

This starts both servers concurrently:
- **Backend** → `http://localhost:5000`
- **Frontend** → `http://localhost:5173`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Get current user |
| GET | `/api/auth/users` | Private | Get all users |
| GET | `/api/auth/users/email/:email` | Private | Find user by email |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/projects` | Private | Get all accessible projects |
| POST | `/api/projects` | Admin | Create a project |
| GET | `/api/projects/:id` | Private | Get project by ID |
| DELETE | `/api/projects/:id` | Admin | Delete a project + its tasks |
| POST | `/api/projects/:id/members` | Admin | Add member to project |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove member |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks` | Private | Get tasks (filtered by role) |
| POST | `/api/tasks` | Admin | Create a task |
| PUT | `/api/tasks/:id` | Admin | Full update (title, assignees, due date) |
| DELETE | `/api/tasks/:id` | Admin | Delete a task |
| PUT | `/api/tasks/:id/status` | Private | Update task status only |

---

## 🔐 Role-Based Access Control

```
Admin  →  Full CRUD on projects and tasks, member management
Member →  Read projects (assigned), read+update-status own tasks
```

JWT tokens are attached to every request via an Axios interceptor. The backend middleware (`auth.js` + `rbac.js`) validates the token and enforces role permissions on every protected route.

---

## ☁️ Deploying to Railway

1. Push this repository to GitHub.

2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**.

3. Select your repository.

4. Under **Variables**, add:

   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A strong random secret |
   | `NODE_ENV` | `production` |

5. Railway will automatically run:
   - `npm install` (installs root + builds frontend)
   - `npm start` → runs `node backend/server.js`

   The Express server serves the built React app from `frontend/dist` in production.

---

## 📸 Screenshots

> Add screenshots of your dashboard, project board, and login page here.

---

## 📄 License

MIT © 2026 Team Task Manager
