# LibraryHub - Modern Library Management System

A comprehensive full-stack library management system built with React, Node.js, Express, and MongoDB. This system is designed to automate library operations including book management, member registration, book borrowing/returning, and late fee calculations.

## Features

### Core Features
- **User Authentication**: JWT-based authentication with role-based access control (Admin/Member)
- **Book Management**: Full CRUD operations for books with categories and search
- **Online Public Access Catalogue (OPAC)**: Search and browse books with advanced filters
- **Circulation System**: Issue, return, and renew books
- **Late Fee Calculation**: Automatic calculation of late fees
- **Member Management**: Registration and management of library members
- **Dashboard**: Real-time statistics and recent activity

### Technical Features
- Modern, responsive UI with Tailwind CSS
- Smooth animations with Framer Motion
- RESTful API design
- MongoDB with Mongoose ODM

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Query
- Lucide React (icons)
- Framer Motion

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

## GitHub CLI Setup

To deploy this project to GitHub, you'll need to install the GitHub CLI and authenticate.

### Install GitHub CLI

**Windows (if not already installed):**
```
powershell
winget install GitHub.cli
```

After installation, **close and reopen your terminal** to use `gh` command.

### Authenticate with GitHub

```
bash
gh auth login
```

Follow the prompts:
1. Select "GitHub.com"
2. Select "HTTPS"
3. Select "Login with a web browser"
4. Copy the one-time code shown in terminal
5. Authorize the CLI in your browser

### Create Repository and Deploy

Once authenticated, run these commands in the project directory:

```
bash
# Initialize git if not already done
git init

# Create a new repository on GitHub
gh repo create library-management-system --public --source=. --description "Modern Library Management System with React, Node.js, Express, and MongoDB"

# Push to GitHub
git add .
git commit -m "Initial commit: Library Management System"
git branch -M main
git push -u origin main
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   
```bash
   cd library-management-system
   
```

2. **Install backend dependencies**
   
```
bash
   cd backend
   npm install
   
```

3. **Install frontend dependencies**
   
```
bash
   cd frontend
   npm install
   
```

4. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   
```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/libraryhub
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   
```

### Running the Application

1. **Start the backend**
   
```
bash
   cd backend
   npm run dev
   
```
   The API will run on http://localhost:5000

2. **Start the frontend**
   
```
bash
   cd frontend
   npm run dev
   
```
   The application will run on http://localhost:5173

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Books
- GET `/api/books` - Get all books
- GET `/api/books/:id` - Get single book
- POST `/api/books` - Create book (Admin)
- PUT `/api/books/:id` - Update book (Admin)
- DELETE `/api/books/:id` - Delete book (Admin)

### Circulation
- POST `/api/circulation/issue` - Issue book
- POST `/api/circulation/return` - Return book
- POST `/api/circulation/renew` - Renew book
- GET `/api/circulation/active` - Get active circulations
- GET `/api/circulation/overdue` - Get overdue books

## Project Structure

```
library-management-system/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/         # API services
│   │   ├── context/         # React context
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Custom middleware
│   │   └── config/          # Configuration
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

## Default Admin Account

After seeding, you can login with:
- Email: admin@libraryhub.com
- Password: admin123

## License

MIT
