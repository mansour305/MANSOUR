require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const salariesRoutes = require('./modules/salaries/salaries.routes');
const supportsRoutes = require('./modules/supports/supports.routes');
const calendarRoutes = require('./modules/calendar/calendar.routes');
const servicesRoutes = require('./modules/services/services.routes');
const tripsRoutes = require('./modules/trips/trips.routes');
const notificationsRoutes = require('./modules/notifications/notifications.routes');
const newsRoutes = require('./modules/news/news.routes');
const jobsRoutes = require('./modules/jobs/jobs.routes');
const settingsRoutes = require('./modules/settings/settings.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');
const db = require('./database/models');

const app = express();
const PORT = config.server.port;
const isProduction = config.server.env === 'production';

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: isProduction,
  crossOriginEmbedderPolicy: isProduction
}));

// CORS Configuration
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logging
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Body Parsing with limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Initialize Database
db.initializeDatabase();

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/salaries', salariesRoutes);
app.use('/api/supports', supportsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.server.env });
});

// Protected Routes (Admin Only)
app.use('/api/admin', authMiddleware, require('./middleware/auth').adminOnly, dashboardRoutes);

// Error Handler - Hide stack trace in production
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mawaeedak API running on port ${PORT}`);
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${config.server.env}`);
});

module.exports = app;
