# SkillSwap - Skill Exchange Platform

A MERN stack application for exchanging skills between users.

## Project Structure

```
skillswap-fullstack/
├── client/          # React frontend
├── server/          # Express backend
└── package.json     # Root package.json with scripts
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   npm run install-all
   ```

2. **Configure MongoDB:**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Update `server/.env` with your MongoDB URI

3. **Configure Environment Variables:**
   
   Update `server/.env`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend client (port 3000).

## Features

- User authentication (register/login)
- JWT-based authorization
- Skill CRUD operations
- Request system for skill exchanges
- Responsive design with Tailwind CSS
- Protected routes

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Database:** MongoDB

## Development Progress

✅ **Day 1 - Project Setup**
- Project structure created
- Backend setup with Express and MongoDB
- Frontend setup with Vite and React
- Authentication system implemented
- Basic UI components and routing

## Next Steps

- Day 2: Build User Auth frontend
- Day 3: Auth System Frontend
- Day 4: Skill CRUD APIs
- Day 5: Skill CRUD UI
- And so on...

## Scripts

- `npm run dev` - Start both client and server
- `npm run client` - Start only the client
- `npm run server` - Start only the server
- `npm run build` - Build the client for production
