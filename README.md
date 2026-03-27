# ReviseFlow

ReviseFlow is a full-stack DSA revision tracker that helps you log solved problems and automatically schedules spaced repetitions for Day 1, Day 3, and Day 7.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: SQLite with `better-sqlite3`

## Features

- Add a DSA problem with a topic
- Auto-create revision tasks for Day 1, Day 3, and Day 7
- View today's revisions
- Mark revisions as completed
- Track dashboard analytics
- Browse all logged problems
- Edit and delete problems
- Topic-based filtering

## Project Structure

```text
ReviseFlow/
|-- backend/
|   |-- routes/
|   |   |-- dashboard.js
|   |   |-- problems.js
|   |   `-- revisions.js
|   |-- db.js
|   |-- server.js
|   |-- package.json
|   `-- package-lock.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   `-- vite.config.js
|-- .gitignore
`-- README.md
```

## Setup

### 1. Install dependencies

```powershell
cd backend
npm.cmd install
```

```powershell
cd frontend
npm.cmd install
```

### 2. Start the backend

```powershell
cd backend
npm.cmd run dev
```

Backend runs on:

```text
http://localhost:4000
```

### 3. Start the frontend

```powershell
cd frontend
npm.cmd run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Environment

The frontend can optionally use a custom API URL through `VITE_API_BASE_URL`.

Example:

```text
VITE_API_BASE_URL=http://localhost:4000
```

## API Endpoints

### Problems

- `POST /problems` - add a problem
- `GET /problems` - list all problems
- `PUT /problems/:id` - update a problem
- `DELETE /problems/:id` - delete a problem

### Revisions

- `GET /revisions/today` - get today's revisions
- `PUT /revisions/:id` - update revision status

### Dashboard

- `GET /dashboard` - get totals, topic counts, and revision progress

## Notes

- The SQLite database file is stored at `backend/reviseflow.db`
- That database file is ignored in Git by default
- `node_modules` and frontend build outputs are also ignored

## GitHub Push

If this folder is not already a Git repository, run:

```powershell
git init
git branch -M main
git remote add origin <your-github-repo-url>
```

Then commit and push:

```powershell
git add .
git commit -m "Initial commit"
git push -u origin main
```

If the remote already exists, use:

```powershell
git remote set-url origin <your-github-repo-url>
git push -u origin main
```
