# Blogify - MERN Stack Blogging Platform

A full-stack blogging application built with the MERN stack (MongoDB, Express, React, Node.js). Blogify allows users to create, read, like, and comment on blog posts, follow other users, and customize their experience with multiple theme options.

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (local)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v20 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local instance running)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Blogify
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/blogify
JWT_SECRET=your-secret-key-here
```

**Note:** Replace `your-secret-key-here` with a secure random string for production.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# On Windows (if installed as service, it should start automatically)
# Or manually:
mongod

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## 🧪 Test Credentials

The application comes with seeded test users:

- **User 1:**
  - Email: `user1@example.com`
  - Password: `password123`

- **User 2:**
  - Email: `user2@example.com`
  - Password: `password123`

## 📝 Features

### Authentication
- User registration
- User login/logout
- JWT-based authentication
- Protected routes

### Blog Management
- Create blog posts with rich content
- View all blogs on home page
- View individual blog details
- Like/unlike blogs
- Add comments to blogs

### User Profiles
- View user profiles
- See followers and following counts
- View user's blog posts
- Follow/unfollow users

### UI/UX
- Multiple theme options (Light, Dark, Blue, Minimal)
- Responsive design
- Loading states
- Error handling
- Empty state messages

## 📁 Project Structure

```
Blogify/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── app.js           # Express app setup
│   │   └── server.js         # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React contexts
│   │   ├── pages/           # Page components
│   │   ├── router/          # Routing configuration
│   │   ├── services/        # API service layer
│   │   ├── theme/           # Theme configuration
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Root component
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user

### Blogs
- `GET /api/v1/posts` - Get all blogs
- `GET /api/v1/posts/:postId` - Get single blog
- `POST /api/v1/posts` - Create blog (Protected)
- `POST /api/v1/posts/:postId/like` - Like blog (Protected)
- `DELETE /api/v1/posts/:postId/like` - Unlike blog (Protected)

### Comments
- `POST /api/v1/posts/:postId/comments` - Add comment (Protected)
- `POST /api/v1/comments/:commentId/reply` - Reply to comment (Protected)

### Users
- `GET /api/v1/users/:userId` - Get user profile
- `POST /api/v1/users/:userId/follow` - Follow user (Protected)
- `DELETE /api/v1/users/:userId/follow` - Unfollow user (Protected)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check service status
- Verify connection string in `.env` file
- Check MongoDB is listening on default port 27017

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Vite will automatically use next available port

### CORS Issues
- Ensure backend CORS is configured correctly
- Check that frontend is making requests to correct backend URL

### Authentication Issues
- Clear browser localStorage if token issues persist
- Check JWT_SECRET is set in backend `.env`

## 📦 Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

## 🤝 Contributing

This is a demo project. For production use, consider:
- Adding input sanitization
- Implementing rate limiting
- Adding image upload functionality
- Implementing pagination
- Adding search functionality
- Implementing email verification

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Blogify - MERN Stack Blogging Platform

---

**Note:** Make sure MongoDB is running before starting the backend server. The application requires a local MongoDB instance.

