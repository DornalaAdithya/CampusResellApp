# Campus Resell - Backend API Server

This is the backend server for the Campus Resell application. It provides a secure RESTful API, connects to a MongoDB database, manages cloud asset storage, and powers real-time WebSockets for the chat messaging system.

## Tech Stack

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | Runtime Environment     |
| Express.js | API Framework & Routing |
| MongoDB    | NoSQL Database          |
| Mongoose   | Object Data Modeling    |
| JWT        | Secure Authentication   |
| Bcrypt     | Password Hashing        |
| Multer     | Multipart Data Parsing  |
| Cloudinary | Cloud Image Storage     |
| Socket.IO  | Real-Time WebSockets    |

## Key Features

* **Domain-Restricted Auth:** API-level validation enforcing that only emails ending in `@anurag.edu.in` can register.
* **Stateless Security:** Implements JWT-based authentication using HTTP-only cookies, entirely bypassing local storage vulnerabilities on the client side.
* **Optimized Image Handling:** Uses Multer to temporarily parse incoming memory buffers and directly uploads them to Cloudinary, ensuring the server doesn't get bloated with heavy image files.
* **Real-time WebSockets:** Runs a parallel Socket.IO server on top of the HTTP server. It maintains a mapping of logged-in user IDs to their active socket IDs to facilitate targeted, real-time message broadcasting and typing indicators.

## Database Architecture (Mongoose Models)

* **User Model:** Stores `firstName`, `lastName`, `email`, hashed `password`, `profileUrl`, and `role`.
* **Product Model:** Stores `title`, `price`, `description`, `productImages` array, and maintains an `owner` reference to the User model. Uses compound indexing for rapid search queries.
* **Conversation & Message Models:** Manages the relational links between Buyers, Sellers, Products, and individual text payloads.

## Installation & Setup

1. Ensure you have Node.js and MongoDB installed locally (or access to a MongoDB Atlas cluster).
2. Clone the repository and navigate to this directory:
   ```bash
   cd campus-resell-backend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the `campus-resell-backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   
   JWT_SECRET=your_super_secret_jwt_key
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. Start the server:
   ```bash
   npm run dev
   # or node server.js
   ```

## Project Structure

* `/config`: Database connection logic (`db.js`).
* `/controllers`: Business logic for handling requests (Auth, Users, Products, Chat).
* `/middlewares`: Custom express middlewares for verifying JWTs and handling Multer uploads.
* `/models`: Mongoose database schemas.
* `/routes`: API endpoint definitions mounting controllers.
* `/socket`: WebSocket server initialization and event listeners.
