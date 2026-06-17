/**
 * rateLimiter.ts — Phase 17
 * 
 * Rate Limiting Middleware for Mawaeedak API
 * 
 * SECURITY: Protects against DDoS and brute-force attacks
 * Uses express-rate-limit with memory store for single-instance deployments
 * For multi-instance deployments, consider Redis store.
 */

import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 * Limits requests per IP to 100 requests per 15 minutes
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    error: "طلبات كثيرة جداً، حاول لاحقاً",
    retryAfter: 900, // seconds
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For if behind proxy, otherwise use IP
    return req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim()
      || req.socket.remoteAddress
      || "unknown";
  },
});

/**
 * Strict rate limiter for auth endpoints
 * Limits requests per IP to 10 requests per 15 minutes
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "محاولات تسجيل دخول كثيرة، انتظر قبل المحاولة مرة أخرى",
    retryAfter: 900,
  },
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim()
      || req.socket.remoteAddress
      || "unknown";
  },
});

/**
 * Admin endpoints rate limiter
 * Limits requests per IP to 200 requests per 15 minutes
 * Admins typically need more requests for dashboard operations
 */
export const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "طلبات كثيرة على لوحة التحكم، حاول لاحقاً",
    retryAfter: 900,
  },
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim()
      || req.socket.remoteAddress
      || "unknown";
  },
});

/**
 * Read-heavy endpoints rate limiter
 * Limits to 300 requests per 15 minutes for data fetching
 */
export const readRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "طلبات كثيرة، انتظر قليلاً",
    retryAfter: 900,
  },
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim()
      || req.socket.remoteAddress
      || "unknown";
  },
});

/**
 * Write operations rate limiter
 * Stricter limits for POST/PATCH/DELETE operations
 * Limits to 30 requests per 15 minutes
 */
export const writeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "عدد كبير من العمليات، انتظر قليلاً",
    retryAfter: 900,
  },
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim()
      || req.socket.remoteAddress
      || "unknown";
  },
});

export default apiRateLimiter;
