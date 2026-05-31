# Campus Resell - Frontend Client

This is the frontend client for the Campus Resell application. It provides a modern, responsive, and real-time user interface for university students to buy and sell second-hand products.

## Tech Stack

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React 19         | Core UI Framework       |
| Vite             | Build Tool & Dev Server |
| Tailwind CSS v4  | Utility-First Styling   |
| Zustand          | Global State Management |
| React Router v7  | Client-Side Routing     |
| Axios            | API Communication       |
| Socket.IO Client | Real-Time Messaging     |
| React Hot Toast  | User Notifications      |

## Key Features

* **Real-time Chat UI:** A dynamic inbox interface that communicates with the backend WebSocket server for instant message delivery and typing indicators.
* **Protected Routes:** Utilizing React Router to guard sensitive pages (like Selling and Profile) from unauthenticated access.
* **Global Stores:** Zustand stores (`authStore` and `chatStore`) manage complex application states without the boilerplate of Redux.
* **Responsive Design:** Fully mobile-optimized layouts using Tailwind CSS utility classes and custom Google Fonts (`Sora`).
* **Image Gallery:** Custom-built product image galleries with thumbnail navigation for seamless browsing.

## Installation & Setup

1. Ensure you have Node.js installed.
2. Clone the repository and navigate to this directory:
   ```bash
   cd campus-resell-frontend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the `campus-resell-frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

* `npm run dev`: Starts the Vite development server.
* `npm run build`: Bundles the application for production.
* `npm run lint`: Runs ESLint to identify code issues.
* `npm run preview`: Locally previews the production build.

## Project Structure

* `/src/api`: Axios instance configurations and interceptors.
* `/src/components`: Reusable UI components (Navbars, Loaders, Product Cards).
* `/src/pages`: Top-level route components (Home, Profile, Inbox, etc).
* `/src/stores`: Zustand global state managers.
* `/src/styles`: Shared style constants.
