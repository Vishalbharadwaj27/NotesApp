# NotesApp

A full-stack notes management application that allows users to create, organize, and track notes with priority levels and reminder notifications.

The system is designed with a modular architecture using React for the frontend and Node.js with Express and MySQL for the backend.

---

## Features

### User Authentication
- User registration
- Secure login
- JWT-based authentication
- Protected API routes

### Notes Management
- Create notes
- Search notes
- Delete notes
- Persistent storage using MySQL

### Priority-Based Notes
Each note can be assigned a priority level during creation.

Priority Levels:
- HIGH
- MEDIUM
- LOW

Notes are automatically sorted by priority so that important tasks always appear first.

Priority sorting order:

1. HIGH
2. MEDIUM
3. LOW

If multiple notes share the same priority, they are ordered by creation time.

### Reminder Notification System

The application includes a reminder system that notifies users about notes that may represent unfinished tasks.

Reminder behavior:

- After 24 hours of creating a note, the system prompts the user.
- The notification asks whether the task has been completed.

Notification message template:

"You created this note yesterday. Have you completed it?"

User actions:

**YES**
- Opens confirmation dialog
- User can delete the note if the task is finished

**NOT YET**
- The reminder becomes pinned
- It stays visible until the task is completed or the note is deleted

This helps users track unfinished work.

---

## Project Structure

```

NotesApp-main
│
├── server.js
├── package.json
│
├── src
│   ├── controllers
│   │   ├── authController.js
│   │   ├── notesController.js
│   │   └── tagsController.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   └── tagRoutes.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   └── db
│       └── mysql.js
│
└── frontend
├── index.html
├── package.json
├── vite.config.js
│
└── src
├── App.jsx
├── main.jsx
│
├── api
│   ├── api.js
│   ├── authApi.js
│   └── notesApi.js
│
├── components
│   ├── NoteCard.jsx
│   ├── NoteForm.jsx
│   ├── SearchBar.jsx
│   └── NotificationPanel.jsx
│
├── pages
│   ├── DashboardPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
│
├── layout
│   └── AppLayout.jsx
│
└── utils
└── auth.js

```

---

## Tech Stack

Frontend
- React
- Vite
- JavaScript
- CSS

Backend
- Node.js
- Express.js
- MySQL

Authentication
- JWT

API Communication
- RESTful APIs

---

## Installation

### 1. Clone the repository

```

git clone <repository-url>
cd NotesApp-main

```

### 2. Install backend dependencies

```

npm install

```

### 3. Install frontend dependencies

```

cd frontend
npm install

```

---

## Environment Configuration

Create a `.env` file in the root directory.

Example configuration:

```

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=notesapp

JWT_SECRET=your_secret_key

```

---

## Running the Application

Start the backend server:

```

npm start

```

Start the frontend development server:

```

cd frontend
npm run dev

```

The frontend will run on:

```

[http://localhost:5173](http://localhost:5173)

```

The backend API runs on:

```

[http://localhost:5000](http://localhost:5000)

```

---

## API Endpoints

Authentication

```

POST /api/auth/register
POST /api/auth/login

```

Notes

```

GET    /api/notes
POST   /api/notes
DELETE /api/notes/:id

```

Tags

```

GET    /api/tags
POST   /api/tags

```

---

## Database Schema (Simplified)

Notes Table

```

## notes

id
title
content
priority (HIGH | MEDIUM | LOW)
completed (BOOLEAN)
created_at
user_id

```

Tags Table

```

## tags

id
name

```

---

## Future Improvements

- Push notifications
- Note editing
- Tag filtering
- Mobile responsiveness
- Reminder scheduling customization

---

## License

This project is intended for educational and development purposes.
```
