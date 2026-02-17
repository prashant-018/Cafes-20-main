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
import { validateEnvironmentOrExit } from './utils/validateEnv';

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

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Allowed origins for CORS
const getAllowedOrigins = (): string[] => {
  const origins = [CLIENT_URL];

  // In development, allow common development ports
  if (NODE_ENV === 'development') {
    origins.push(
      'http://localhost:5173',  // Vite default
      'http://localhost:3000',  // React/Next.js default
      'http://localhost:8080',  // Alternative port
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080'
    );
  }

  // Remove duplicates
  return [...new Set(origins)];
};

const allowedOrigins = getAllowedOrigins();

console.log('🌐 CORS Configuration:');
console.log('   Environment:', NODE_ENV);
console.log('   Allowed Origins:', allowedOrigins);

// Initialize Socket.IO with proper CORS for cross-site
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  Socket.IO CORS blocked origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by Socket.IO CORS`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // ✅ CRITICAL: Enable credentials for cross-site WebSocket
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ]
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  // ✅ Additional cross-site configuration
  cookie: false, // Don't use cookies for Socket.IO (we use JWT in headers)
  pingTimeout: 60000,
  pingInterval: 25000
});

// Set Socket.IO instance for controllers
setSocketIO(io);
setMenuLocalSocketIO(io);
setSettingsSocketIO(io);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false
}));

// Compression middleware
app.use(compression());

// CORS middleware - MUST be before routes
// ✅ CRITICAL: Proper CORS for cross-site Netlify → Render
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      console.warn(`   Allowed origins:`, allowedOrigins);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // ✅ CRITICAL: Enable credentials for cross-site requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization'],
  maxAge: 86400, // 24 hours - cache preflight
  preflightContinue: false, // ✅ End preflight here
  optionsSuccessStatus: 204 // ✅ Proper status for OPTIONS
}));

// ✅ CRITICAL: Handle preflight OPTIONS requests explicitly
app.options('*', cors());

// Body parsing middleware - MUST be before routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.headers.origin || 'no-origin';

  // Log all requests in production for debugging CORS
  if (NODE_ENV === 'production' || NODE_ENV === 'development') {
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    console.log(`   Origin: ${origin}`);

    // Log preflight requests explicitly
    if (req.method === 'OPTIONS') {
      console.log('   🔍 PREFLIGHT REQUEST');
      console.log('   Access-Control-Request-Method:', req.headers['access-control-request-method']);
      console.log('   Access-Control-Request-Headers:', req.headers['access-control-request-headers']);
    }

    if (req.body && Object.keys(req.body).length > 0 && NODE_ENV === 'development') {
      console.log('   Body:', JSON.stringify(req.body, null, 2));
    }
  }

  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'The Himalayan Pizza API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    cors: {
      allowedOrigins: allowedOrigins
    }
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
    environment: NODE_ENV,
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
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuImageRoutes);
app.use('/api/menu-local', menuLocalRoutes);
app.use('/api/menu-simple', menuSimpleRoutes);
app.use('/api/business-settings', businessSettingsRoutes);
app.use('/api/settings', settingsRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ Socket.IO client connected: ${socket.id}`);

  // Join admin room for real-time updates
  socket.on('joinAdmin', () => {
    socket.join('admin');
    console.log(`👤 Admin joined: ${socket.id}`);
  });

  // Join user room for real-time updates
  socket.on('joinUser', () => {
    socket.join('user');
    console.log(`👤 User joined: ${socket.id}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`❌ Socket.IO client disconnected: ${socket.id} - Reason: ${reason}`);
  });

  socket.on('error', (error) => {
    console.error(`❌ Socket.IO error for ${socket.id}:`, error);
  });
});

// 404 handler for undefined routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Start server function
const startServer = async () => {
  try {
    // Validate environment variables FIRST (will exit if invalid)
    validateEnvironmentOrExit();

    // Connect to MongoDB
    await connectDB();

    // Then start the server
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🍕 The Himalayan Pizza - Backend API                ║
║                                                        ║
║   🚀 Server running on port ${PORT}                      ║
║   📊 Environment: ${NODE_ENV.padEnd(11)}                      ║
║   🌐 Frontend URL: ${CLIENT_URL.padEnd(30)} ║
║   📡 Socket.IO enabled                                 ║
║   🔒 CORS configured                                   ║
║                                                        ║
║   Available Routes:                                    ║
║   • POST /api/auth/login                               ║
║   • POST /api/auth/admin/login                         ║
║   • POST /api/auth/register                            ║
║   • GET  /api/settings                                 ║
║   • PUT  /api/settings (Admin)                         ║
║   • GET  /api/health                                   ║
║                                                        ║
║   🧪 Test: curl http://localhost:${PORT}/api/health        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }

    console.error('\n💡 Please fix the configuration errors above and restart the server.\n');
    process.exit(1);
  }
};

// Start the server
startServer();

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('✅ HTTP server closed');

    io.close(() => {
      console.log('✅ Socket.IO server closed');
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
