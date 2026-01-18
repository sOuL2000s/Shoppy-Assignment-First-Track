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

    app.post("/api/auth/signup", validateSignup, controller.signup);
    app.post("/api/auth/verify-otp", controller.verifyOtp);
    app.post("/api/auth/login", controller.login);
};