// Simple in-memory rate limiter
const rateLimitStore = new Map();

function rateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // max requests per window
    message = 'Too many requests'
  } = options;

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Initialize or reset bucket
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const bucket = rateLimitStore.get(key);
    
    // Reset if window expired
    if (now > bucket.resetTime) {
      bucket.count = 1;
      bucket.resetTime = now + windowMs;
      return next();
    }
    
    // Increment count
    bucket.count++;
    
    // Check limit
    if (bucket.count > max) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((bucket.resetTime - now) / 1000)
      });
    }
    
    next();
  };
}

// Stricter rate limiter for auth endpoints
function authRateLimiter() {
  return rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many login attempts. Please try again later.'
  });
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore.entries()) {
    if (now > bucket.resetTime + 60000) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

module.exports = { rateLimiter, authRateLimiter };
