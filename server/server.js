import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TaskBuddy Backend API is running',
    database: mongoose.connection.readyState === 1 ? 'mongodb' : 'file-json (server/data/db.json)',
    timestamp: new Date().toISOString(),
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB or fall back to JSON file storage
async function startServer() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`Attempting connection to MongoDB at: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log('✅ Connected to MongoDB successfully.');
    } catch (err) {
      console.warn(`⚠️ Could not connect to MongoDB (${err.message}).`);
      console.log('📁 Falling back to persistent file storage at server/data/db.json');
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided in server/.env.');
    console.log('📁 Using persistent file storage at server/data/db.json');
  }

  app.listen(PORT, () => {
    console.log(`🚀 TaskBuddy Server running on port ${PORT} (http://localhost:${PORT})`);
  });
}

startServer();
