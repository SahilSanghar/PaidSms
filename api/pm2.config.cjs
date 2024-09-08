module.exports = {
  apps : [
      {
        name: "server",
        script: "src/app.js",
        watch: true,
        env: {        
	
MONGO_URI: "mongodb://localhost:27017/express-backend",
GOOGLE_CLIENT_ID: "949821449015-p5eamifnjn8s2t5vuqob5uq41r0ss36i.apps.googleusercontent.com",
GOOGLE_CLIENT_SECRET: "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",
MAIL_USER: "noreplypaidsms@gmail.com",
JWT_SECRET_KEY: "kjsdkjgfiauseyifusfbm",
PORT: 8000,
BASE_URL: "https://api.paidsms.in",
MAIL_PASS: "khxd sfjq rrdw ecrl",
ALLOWEDORIGINS: ["https://paidsms.in/", "https://merogharmeripehchanhai.paidsms.in/"],
RECAPTCHA_SECRET_KEY: "6LfwQCwqAAAAABaR5kvqE3EGW6AmZbM1UlUe_WPN"


        }
      }
  ]
}
