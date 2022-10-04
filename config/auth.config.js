module.exports = {
  // secret: process.env.SESSUION_SECRET_KEY,
  secret: "process.env.SESSION_SECRET_KEY",
  jwtExpiration: 3600,           // 1 hour
  jwtRefreshExpiration: 86400,   // 24 hours
  
  /* for test */
  // jwtExpiration: 60,          // 1 minute
  // jwtRefreshExpiration: 120,  // 2 minutes
};