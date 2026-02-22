# Library Management System - Specification Document

## 1. Project Overview

**Project Name:** LibraryHub - Modern Library Management System  
**Project Type:** Full-stack Web Application  
**Core Functionality:** A comprehensive library management system featuring book catalog management, member management, borrowing/returning system, online public access catalogue (OPAC), and administrative features similar to the Embu Uni library system.  
**Target Users:** Library administrators, staff members, and library patrons/students

## 2. Technology Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router DOM (navigation)
- Axios (HTTP client)
- React Query (data fetching)
- Lucide React (icons)
- Framer Motion (animations)

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for validation
- CORS for cross-origin requests

## 3. UI/UX Specification

### Color Palette
- **Primary:** #1e3a5f (Deep Navy Blue)
- **Secondary:** #c9a227 (Golden Amber)
- **Accent:** #2d6a4f (Forest Green)
- **Background:** #f8f9fa (Light Gray)
- **Surface:** #ffffff (White)
- **Text Primary:** #1a1a2e (Dark Blue-Black)
- **Text Secondary:** #6c757d (Gray)
- **Success:** #28a745 (Green)
- **Warning:** #ffc107 (Amber)
- **Danger:** #dc3545 (Red)
- **Info:** #17a2b8 (Cyan)

### Typography
- **Primary Font:** "Playfair Display" (headings)
- **Secondary Font:** "Source Sans Pro" (body text)
- **Heading Sizes:**
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
- **Body:** 1rem (16px)
- **Small:** 0.875rem (14px)

### Layout Structure
- **Header:** Fixed navigation bar with logo, main menu, search, and user controls
- **Sidebar:** Collapsible sidebar for admin panel navigation
- **Main Content:** Responsive grid layout
- **Footer:** Site info, quick links, contact details

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Effects
- Card hover: subtle shadow elevation
- Button hover: color transition 0.3s
- Page transitions: fade-in with Framer Motion
- Loading states: skeleton screens
- Toast notifications for actions

## 4. Pages & Components

### Public Pages
1. **Home Page**
   - Hero section with animated search
   - Quick access cards (Catalog, Services, About)
   - News & announcements carousel
   - Library statistics
   - Contact information

2. **OPAC (Online Public Access Catalogue)**
   - Advanced search with filters (title, author, ISBN, category)
   - Book grid/list view toggle
   - Book detail modal with availability
   - Book cover images
   - Reserve book functionality

3. **Login/Register Pages**
   - Clean authentication forms
   - Role-based login (Member/Admin)

### Admin Dashboard
1. **Dashboard Home**
   - Statistics overview (total books, members, borrowed, overdue)
   - Recent activities feed
   - Quick action buttons
   - Charts for data visualization

2. **Book Management**
   - Add/Edit/Delete books
   - Bulk import
   - Category management
   - Book availability tracking

3. **Member Management**
   - Add/Edit/Delete members
   - Member status (active/suspended)
   - Member history view

4. **Circulation Management**
   - Issue books
   - Return books
   - Renewals (max 2 times before due date)
   - Overdue tracking
   - Late fee calculation

5. **Reports**
   - Circulation reports
   - Member reports
   - Overdue reports

## 5. Features List

### Core Features
- [x] User authentication (JWT)
- [x] Role-based access control (Admin, Member)
- [x] Book catalog management (CRUD)
- [x] Member registration & management
- [x] Book borrowing system
- [x] Book return & renewal system
- [x] Book reservation system
- [x] Late fee calculation
- [x] Advanced search & filtering
- [x] Category/Department management
- [x] Dashboard with statistics
- [x] Activity logs
- [x] Responsive design

### API Endpoints

#### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

#### Books
- GET /api/books
- GET /api/books/:id
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id
- GET /api/books/search

#### Members
- GET /api/members
- GET /api/members/:id
- POST /api/members
- PUT /api/members/:id
- DELETE /api/members/:id

#### Circulation
- POST /api/circulation/issue
- POST /api/circulation/return
- POST /api/circulation/renew
- GET /api/circulation/active
- GET /api/circulation/history
- GET /api/circulation/overdue

## 6. Data Models

### User Model
```
{
  name: string,
  email: string,
  password: string,
  role: enum['admin', 'member'],
  phone: string,
  createdAt: Date
}
```

### Book Model
```
{
  title: string,
  author: string,
  ISBN: string,
  category: string,
  publisher: string,
  publishYear: number,
  description: string,
  coverImage: string,
  totalCopies: number,
  availableCopies: number,
  location: string,
  createdAt: Date
}
```

### Circulation Model
```
{
  book: ObjectId,
  member: ObjectId,
  issuedBy: ObjectId,
  issueDate: Date,
  dueDate: Date,
  returnDate: Date | null,
  status: enum['issued', 'returned', 'overdue'],
  renewals: number,
  lateFee: number
}
```

## 7. Acceptance Criteria

1. User can register and login with JWT authentication
2. Admin can perform full CRUD on books and members
3. Members can search and view book catalog
4. Members can borrow available books
5. Members can return books with automatic late fee calculation
6. Members can renew books (max 2 times before due date)
7. Dashboard shows real-time statistics
8. Responsive design works on all devices
9. Smooth animations enhance user experience
10. Clean, modern UI following the color scheme
