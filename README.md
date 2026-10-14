# TaskBuddy 🚀

TaskBuddy is a full-stack, responsive task management application built with a modern React + Vite frontend and a secure Node.js + Express backend. It provides an intuitive interface for managing daily tasks with priority rankings, categorized tagging, visual progress tracking, user authentication, and persistent data storage via MongoDB with an automatic local JSON fallback.

---

## 🌟 Features

### 🖥️ Frontend (`client/`)

- **Modern React + Vite**: Fast reactive UI built with Vite and functional React components.
- **Centralized State**: `App.jsx` cleanly manages all task state and core operations (`addTask`, `updateTask`, `deleteTask`, `clearTask`).
- **Interactive Form (`TaskForm.jsx`)**: Controlled inputs for task description, priority (`High`, `Medium`, `Low`, default `Medium`), and category (`General`, `Work`, `Personal`, default `General`). Automatically resets upon submit.
- **Task List (`TaskList.jsx`)**:
  - Live color-coded priority badges and category tags.
  - Complete / Undo toggle buttons with strikethrough styling (`.completed`).
  - Single-click task deletion.
- **Progress Tracking (`ProgressTracker.jsx`)**:
  - Dynamic completion counter (e.g. *"1 out of 3 tasks completed"*).
  - Smooth animated progress bar computed as `(completed / total) * 100%`.
- **Conditional Actions**: "Clear All Tasks" button dynamically appears only when at least one task exists.
- **Responsive Styling (`style.css`)**: Glassmorphism design system, dark mode palette, micro-animations, and full responsiveness across mobile (375px), tablet (768px), and desktop.

### ⚙️ Backend (`server/`)

- **RESTful API**: Fast and modular architecture built on Express and Node.js.
- **JWT Authentication & bcrypt**: Password hashing with bcrypt (10 rounds) and 7-day signed Bearer tokens for secure session handling.
- **Protected Routes & User Isolation**: Tasks are linked to their respective user (`ObjectId` reference). Users can only access, modify, or delete their own tasks.
- **Persistent Storage**:
  - Primary: MongoDB via Mongoose using `MONGODB_URI` from `server/.env`.
  - Fallback: Automatic fallback to local persistent file storage (`server/data/db.json`) if MongoDB is not running or `MONGODB_URI` is unconfigured.
  - Zero requirement for `mongodb-memory-server` at startup or during clean installations.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19
  - Vite 8
  - Vanilla CSS (Glassmorphism, CSS Grid & Flexbox, Media Queries)
  - Google Fonts (Plus Jakarta Sans, JetBrains Mono)
- **Backend**:
  - Node.js (v18+)
  - Express 4
  - Mongoose 8
  - JSON Web Tokens (`jsonwebtoken`)
  - Password Hashing (`bcryptjs`)
  - Cross-Origin Resource Sharing (`cors`)
  - Environment Management (`dotenv`)
  - Nodemon (dev runner)

---

## 📋 Environment Variables

All backend environment variables are configured in `server/.env`. A template is provided in `server/.env.example`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for Express backend server | `5000` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/taskbuddy` |
| `JWT_SECRET` | Secret key used to sign JWT authentication tokens | *Long random string* |

> [!NOTE]
> If `MONGODB_URI` is omitted or local MongoDB is offline, the backend automatically persists all data to `server/data/db.json` so data survives restarts seamlessly without any external database requirement.

---

## 📡 API Endpoints

All task endpoints require a valid Bearer token in the `Authorization` header (`Bearer <token>`).

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Log in with credentials (`email`, `password`) and receive JWT |

### Tasks (`/api/tasks`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Private | Retrieve all tasks for the authenticated user |
| `POST` | `/api/tasks` | Private | Create a new task (`text`, `priority`, `category`) |
| `PUT` | `/api/tasks/:id` | Private | Update a task (`completed`, `text`, `priority`, `category`) |
| `DELETE` | `/api/tasks/:id` | Private | Delete a specific task by ID |
| `DELETE` | `/api/tasks` | Private | Clear all tasks belonging to the authenticated user |

### System (`/api/health`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server status and database connection indicator |

---

## 🚀 Setup & Execution Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (included with Node.js)
- Optional: Local MongoDB instance or MongoDB Atlas connection string

---

### Step 1: Backend Setup (`server/`)

1. Open a terminal and navigate to the `server/` directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Ensure `.env` is present (copy from `.env.example` if needed):

   ```bash
   cp .env.example .env
   ```

4. Start the backend server:

   ```bash
   npm run dev
   # or
   npm start
   ```

   *The API will be available at `http://localhost:5000`.*

---

### Step 2: Frontend Setup (`client/`)

1. Open a second terminal and navigate to the `client/` directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

   *The frontend application will run at `http://localhost:5173`.*

---

## 🧪 Testing the Complete Workflow

1. Open `http://localhost:5173` in your browser.
2. Click **"Register now"**, enter your name, email, and password (minimum 6 characters), and click **"Create Account"**.
3. View your name and avatar appear in the header next to the **Logout** button.
4. Add tasks using the task creation form with different priorities and categories.
5. Click **Complete** on a task to view the strikethrough styling and observe the progress bar update.
6. Click **Undo** to revert completion.
7. Click **Delete** to remove a task individually.
8. Click **Clear All Tasks** to delete all tasks after confirmation.
9. Click **Logout** to safely end your session.
