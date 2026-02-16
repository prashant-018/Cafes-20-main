# The Himalayan Pizza - Backend API

A robust Node.js + Express + TypeScript backend with JWT authentication and role-based authorization.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **TypeScript**: Full type safety and modern JavaScript features
- **MongoDB**: Document database with Mongoose ODM
- **Security**: Password hashing, input validation, CORS protection
- **Clean Architecture**: MVC pattern with proper separation of concerns

## 📁 Project Structure

```
src/
├── config/
│   └── db.ts              # Database connection
├── controllers/
│   └── auth.controller.ts # Authentication logic
├── middleware/
│   └── auth.middleware.ts # JWT verification & role checks
├── models/
│   └── User.ts           # User model with Mongoose
├── routes/
│   └── auth.routes.ts    # Authentication routes
├── utils/
│   ├── hash.ts           # Password hashing utilities
│   └── jwt.ts            # JWT token utilities
├── app.ts                # Express app configuration
└── server.ts             # Server entry point
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/himalayan-pizza
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production build
   npm run build
   npm start
   ```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/health` | Server health status | Public |

## 🔐 Authentication Flow

1. **Register/Login**: User provides credentials
2. **JWT Token**: Server returns signed JWT token
3. **Protected Routes**: Include token in Authorization header
4. **Role-based Access**: Admin routes require admin role

### Request Examples

**Register:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Protected Route:**
```bash
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: express-validator for request validation
- **CORS Protection**: Configurable cross-origin requests
- **Security Headers**: XSS, CSRF, and other protections
- **Role-based Access**: User and admin role separation

## 🧪 User Roles

- **user**: Default role for regular customers
- **admin**: Administrative access for management

## 📝 Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🔧 Development

- **TypeScript**: Compile with `npm run build`
- **Hot Reload**: Use `npm run dev` for development
- **Linting**: Follow TypeScript strict mode
- **Error Handling**: Comprehensive error middleware

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Update `MONGODB_URI` for production database
3. Use strong `JWT_SECRET`
4. Configure proper CORS origins
5. Run `npm run build && npm start`

---

Built with ❤️ for The Himalayan Pizza