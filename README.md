# Jira-like Task Management System

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

- User Authentication (Sign Up / Login)
- JWT-based Authentication
- User Roles (Admin, User)
- Task Management (Create, Read, Update, Delete)
- Drag-and-Drop Task Status Updates
- Task Assignment
- Search & Filter Tasks
- Comments on Tasks
- Activity Timeline
- Notifications
- Project Grouping
- Due Date Alerts
- Dark Mode Support
- Responsive UI

## 🛠 Tech Stack

- **Frontend**: React.js with Hooks
- **State Management**: Context API
- **Drag and Drop**: react-beautiful-dnd
- **Styling**: Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Bcrypt

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)
- PORT: Server port number
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secret key for JWT

### Frontend (.env)
- REACT_APP_API_URL: Backend API URL

## 📝 API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License. 