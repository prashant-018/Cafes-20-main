import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth.routes';
import menuImageRoutes, { setSocketIO } from './routes/menuImages';
import menuLocalRoutes, { setSocketIO as setMenuLocalSocketIO } from './routes/menuLocal.routes';
import menuSimpleRoutes from './routes/menuSimple.routes';
import businessSettingsRoutes from './routes/businessSettings.routes';
import settingsRoutes from './routes/settings.routes';
import { setSettingsSocketIO } from './controllers/settings.controller';

// Import models to ensure they're registered
import './models/Admin';
import './models/MenuImage';
import './models/MenuImageLocal';
import './models/MenuImageSimple';
import './models/BusinessSettings';
import './models/User';
import './models/Settings';

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Set Socket.IO instance for controllers
setSocketIO(io);
setMenuLocalSocketIO(io);
setSettingsSocketIO(io);

// Security middleware - NO CSP in development
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable CSP for development
}));

// Compression middleware
app.use(compression());

// CORS configuration - Allow frontend on port 8080
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5000"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));
console.log('📁 Static uploads folder configured:', uploadsPath);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'The Himalayan Pizza API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint - Welcome message
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🍕 Welcome to The Himalayan Pizza API',
    version: '1.0.0',
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        adminLogin: 'POST /api/auth/admin/login',
        register: 'POST /api/auth/register'
      },
      settings: {
        get: 'GET /api/settings',
        update: 'PUT /api/settings (Admin only)'
      },
      menu: {
        getImages: 'GET /api/menu-simple',
        uploadImages: 'POST /api/menu-simple/upload (Admin only)',
        deleteImage: 'DELETE /api/menu-simple/:id (Admin only)'
      }
    },
    documentation: 'https://github.com/your-repo/api-docs',
    support: 'Contact: admin@himalayan-pizza.com'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuImageRoutes);
app.use('/api/menu-local', menuLocalRoutes);
app.use('/api/menu-simple', menuSimpleRoutes);
app.use('/api/business-settings', businessSettingsRoutes);
app.use('/api/settings', settingsRoutes);

console.log('✅ All routes registered');
console.log('   - /api/auth');
console.log('   - /api/menu');
console.log('   - /api/menu-local');
console.log('   - /api/menu-simple');
console.log('   - /api/business-settings');
console.log('   - /api/settings');

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Join admin room for real-time updates
  socket.on('joinAdmin', () => {
    socket.join('admin');
    console.log(`Admin joined: ${socket.id}`);
  });

  // Join user room for real-time updates
  socket.on('joinUser', () => {
    socket.join('user');
    console.log(`User joined: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// 404 handler for undefined routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB FIRST
    await connectDB();

    // Then start the server
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🍕 The Himalayan Pizza - Backend API                ║
║                                                        ║
║   🚀 Server running on port ${PORT}                      ║
║   📊 Environment: ${process.env.NODE_ENV || 'development'}                      ║
║   🌐 Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:8080'}    ║
║   📡 Socket.IO enabled                                 ║
║                                                        ║
║   Available Routes:                                    ║
║   • POST /api/auth/login                               ║
║   • POST /api/auth/admin/login                         ║
║   • POST /api/auth/register                            ║
║   • GET  /api/settings                                 ║
║   • PUT  /api/settings (Admin)                         ║
║   • GET  /api/health                                   ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;