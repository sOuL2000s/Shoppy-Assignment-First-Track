const controller = require("../controllers/auth.controller");
const { validateSignup } = require("../middleware/validation");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // New route to trigger OTP email send (first step)
    app.post("/api/auth/send-otp", controller.sendOtp); 
    
    // Signup now performs final registration and OTP validation (second step)
    app.post("/api/auth/signup", validateSignup, controller.signup);
    
    // Removed old verify-otp route
    
    app.post("/api/auth/login", controller.login);
};