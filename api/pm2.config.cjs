module.exports = {
  apps: [
    {
      name: "server",
      script: "src/app.js",
      watch: true,
      env: {
        MONGO_URI: process.env.MONGO_URI,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        MAIL_USER: process.env.MAIL_USER,
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
        PORT: process.env.PORT || 8000,
        BASE_URL: process.env.BASE_URL || "https://api.paidsms.in",
        MAIL_PASS: process.env.MAIL_PASS,
        ALLOWEDORIGINS: (process.env.ALLOWEDORIGINS || "").split(","),
        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY
      }
    }
  ]
};
