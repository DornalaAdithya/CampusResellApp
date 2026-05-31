# Campus Resell

A full-stack, real-time marketplace application built exclusively for university students to buy and sell second-hand products within their campus ecosystem.

Campus Resell creates a secure and trusted environment by restricting registration to verified university email addresses, allowing students to trade books, electronics, cycles, furniture, fashion items, and more with fellow students.

---

## Features

### Authentication & Authorization

* University email-only registration (`@anurag.edu.in`)
* JWT-based authentication
* Secure HTTP-only cookie sessions
* Password hashing using bcrypt
* Protected routes for authenticated users
* Custom authentication middleware
* Secure password update functionality

---

### Marketplace

#### Product Listings

* Create product listings with:

  * Title
  * Description
  * Category
  * Condition
  * Price
  * Up to 5 images

#### Product Management

* Mark products as:

  * AVAILABLE
  * SOLD
* Ownership-based authorization

#### Product Discovery

* Search products
* Category filtering
* Responsive product grid
* Detailed product pages

---

### Real-Time Chat System

* Buyer-to-seller messaging
* Product-specific conversations
* Instant message delivery using Socket.IO
* Typing indicators
* Online user tracking
* Buying and Selling conversation filters
* Persistent message history

---

### User Dashboard

* View profile information
* Upload profile picture
* Change password
* View listing statistics
* Manage active listings
* Track sold items

---

### Cloudinary Integration

* Cloud-based image storage
* Optimized image delivery
* Faster loading times
* Reduced backend storage requirements

---

### Responsive Design

* Mobile-friendly UI
* Tablet support
* Desktop optimized layouts
* Built using Tailwind CSS

---

## Tech Stack

### Frontend

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React 19         | User Interface          |
| Vite             | Build Tool              |
| Tailwind CSS v4  | Styling                 |
| Zustand          | State Management        |
| React Router v7  | Routing                 |
| Axios            | API Communication       |
| React Hook Form  | Form Management         |
| Socket.IO Client | Real-Time Communication |
| React Hot Toast  | Notifications           |

---

### Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | Runtime Environment     |
| Express.js | API Framework           |
| JWT        | Authentication          |
| Bcrypt     | Password Hashing        |
| Multer     | File Upload Handling    |
| Cloudinary | Image Storage           |
| Socket.IO  | Real-Time Communication |

---

### Database

| Technology | Purpose  |
| ---------- | -------- |
| MongoDB    | Database |
| Mongoose   | ODM      |

---

## Project Structure

```bash
campus-resell/
│
├── campus-resell-frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── styles/
│   │   └── App.jsx
│   │
│   └── public/
│
├── campus-resell-backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── server.js
│
└── README.md
```

---

## Database Architecture

### User

```javascript
{
  firstName,
  lastName,
  email,
  password,
  profileUrl,
  role,
  isActive
}
```

### Product

```javascript
{
  owner,
  title,
  price,
  category,
  description,
  productImages,
  condition,
  isNegotiable,
  status,
  views,
  isActive
}
```

### Conversation

```javascript
{
  participants,
  productId,
  lastMessage
}
```

### Message

```javascript
{
  conversationId,
  senderId,
  message,
  isRead
}
```

---

## Application Flow

### Authentication

```text
Register/Login
       ↓
JWT Generated
       ↓
HTTP-Only Cookie
       ↓
Protected Routes Access
```

### Product Listing

```text
Create Product
       ↓
Upload Images
       ↓
Cloudinary Storage
       ↓
Store URLs in MongoDB
       ↓
Display in Marketplace
```

### Messaging

```text
Buyer Contacts Seller
          ↓
Conversation Created
          ↓
Socket Connection
          ↓
Real-Time Messaging
          ↓
Messages Stored in MongoDB
```

---

## Security Features

* JWT Authentication
* HTTP-Only Cookies
* Password Hashing (bcrypt)
* Protected API Routes
* Ownership Validation
* Input Validation
* Secure Image Upload Handling
* Environment Variable Protection

---

## Performance Optimizations

* Zustand for lightweight global state management
* MongoDB indexing for faster product queries (e.g., compound index on category and status)
* Cloudinary image optimization
* Efficient React component rendering
* Socket-based real-time updates
* Lazy loading opportunities for future scaling

---

## Future Enhancements

### Phase 2

* Wishlist functionality
* Product bookmarking
* Product reporting system
* User ratings and reviews
* Admin dashboard
* Push notifications

### Phase 3

* Multiple university support
* Advanced search filters (Backend-side filtering)
* Backend Pagination
* AI-powered product recommendations
* Redis caching
* Microservice architecture

---

## Environment Variables

### Backend

```env
PORT=
MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=
NODE_ENV=
```

### Frontend

```env
VITE_BACKEND_URL=
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/campus-resell.git

cd campus-resell
```

### Backend Setup

```bash
cd campus-resell-backend

npm install

npm run dev
# or node server.js
```

### Frontend Setup

```bash
cd campus-resell-frontend

npm install

npm run dev
```

---

## Scalability Considerations

To support multiple universities and larger user bases:

* Backend pagination using MongoDB aggregation
* Redis caching layer
* Dedicated chat microservice
* CDN asset optimization
* Horizontal scaling for Socket.IO servers
* Multi-tenant university architecture

---

## Project Objective

Campus Resell aims to create a trusted and efficient student marketplace where university students can easily buy and sell second-hand products within their campus community, promoting affordability, sustainability, and convenience.

---


## Adithya D
## Built with MERN Stack.
