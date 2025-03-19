/**
 * Security configuration for the application
 */

// Password policy settings
const passwordPolicy = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  maxLength: 128,
};

// Rate limiting settings
const rateLimiting = {
  loginMaxAttempts: 5,         // Max login attempts before lockout
  loginWindowMs: 15 * 60 * 1000, // 15 minutes window
  signupMaxAttempts: 3,        // Max signup attempts per IP
  signupWindowMs: 60 * 60 * 1000, // 1 hour window
};

// Token security
const tokenSecurity = {
  accessTokenExpirySeconds: 3600, // 1 hour
  refreshTokenExpirySeconds: 7 * 24 * 3600, // 7 days
  useStrictSecureCookies: process.env.NODE_ENV === 'production',
};

// Session security
const sessionSecurity = {
  expiryTimeMs: 24 * 60 * 60 * 1000, // 24 hours
  inactivityTimeoutMs: 30 * 60 * 1000, // 30 minutes of inactivity
};

export {
  passwordPolicy,
  rateLimiting,
  tokenSecurity,
  sessionSecurity,
};
