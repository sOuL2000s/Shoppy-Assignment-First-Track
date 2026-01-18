const controller = require("../controllers/cart.controller");
const { verifyToken, isCustomer } = require("../middleware/authJwt");
const { validateAddToCart } = require("../middleware/validation");

module.exports = function(app) {
    // Requires Customer role
    app.get("/api/customer/cart", [verifyToken, isCustomer], controller.getCart);
    app.post("/api/customer/cart", [verifyToken, isCustomer, validateAddToCart], controller.addToCart);
    app.post("/api/customer/checkout", [verifyToken, isCustomer], controller.checkout);
};