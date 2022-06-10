import rateLimit from "express-rate-limit";

const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes (given here in milliseconds)
  max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const regularRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export { authRateLimiter, regularRateLimiter };
// use these as middlewares to limit the number of requests
