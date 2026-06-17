module.exports = {
  jwt: {
    secret: (() => {
      const secret = process.env.JWT_SECRET;
      if (!secret && process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is required in production environment');
      }
      return secret || 'dev-only-secret-do-not-use-in-prod';
    })(),
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  database: {
    path: process.env.DB_PATH || './database.sqlite'
  },
  server: {
    port: parseInt(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*'
  },
  admin: {
    email: process.env.ADMIN_EMAIL || null,
    password: process.env.ADMIN_PASSWORD || null,
    name: process.env.ADMIN_NAME || 'Administrator'
  }
};
