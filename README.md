# Task Tracker Pro

A production-ready MERN task management application with a premium SaaS-style dashboard, MongoDB Atlas persistence, REST APIs, validation, dark mode, analytics, filters, search, sorting, skeleton loaders, and responsive glassmorphism UI.

## Live Url
https://tasktracker-2-33e9.onrender.com

## Features

- Create, view, update, complete, and delete tasks
- MongoDB Atlas integration with Mongoose models
- Express REST API with validation, centralized error handling, Helmet, Morgan, and CORS
- Search by title, description, or category
- Filter by priority, status, category, and due date
- Sort by newest, oldest, due date, and priority
- Dashboard statistics for total, completed, pending, active, and high-priority work
- Task analytics and distribution views
- React Hook Form validation with real-time feedback
- Toast notifications, loading states, and skeleton loaders
- Dark mode with persisted preference
- Fully responsive layout for desktop, laptop, tablet, and mobile

## Tech Stack

Frontend: React, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios, React Router DOM, React Hook Form, React Hot Toast

Backend: Node.js, Express.js, Mongoose, MongoDB Atlas, Helmet, Morgan, CORS, Express Validator, Dotenv

## Folder Structure

```text
Task-Tracker/
  backend/
    src/
      config/
      controllers/
      middlewares/
      models/
      routes/
      utils/
      validators/
    server.js
  frontend/
    src/
      assets/
      components/
      context/
      hooks/
      layouts/
      pages/
      services/
      utils/
  README.md
```

## Environment Variables

Root `.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=<your-existing-mongodb-atlas-uri>
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run Backend

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:5000`.

## Run Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List tasks with search, filters, sorting, and pagination |
| GET | `/api/tasks/stats` | Dashboard statistics |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Task Schema

```js
{
  title: String,
  description: String,
  priority: 'Low' | 'Medium' | 'High',
  status: 'Pending' | 'In Progress' | 'Completed',
  category: String,
  dueDate: Date,
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

Backend:
- Set `MONGO_URI`, `PORT`, `NODE_ENV=production`, and `FRONTEND_URL` in the hosting provider.
- Deploy the `backend` folder to Render, Railway, Fly.io, or another Node-compatible host.

Frontend:
- Set `VITE_API_URL` to the deployed backend API URL.
- Run `npm run build`.
- Deploy `frontend/dist` to Vercel, Netlify, or any static hosting platform.


