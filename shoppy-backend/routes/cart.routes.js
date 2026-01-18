const controller = require("../controllers/cart.controller");
const { verifyToken, isCustomer } = require("../middleware/authJwt");
const { validateAddToCart } = require("../middleware/validation");

module.exports = function(app) {
    // Requires Customer role
    app.get("/api/customer/cart", [verifyToken, isCustomer], controller.getCart);
    
    // POST for incrementing/adding new item
    app.post("/api/customer/cart", [verifyToken, isCustomer, validateAddToCart], controller.addToCart);
    
    // FIX: PUT for setting specific quantity (including 0 to remove)
    app.put("/api/customer/cart", [verifyToken, isCustomer, validateAddToCart], controller.updateCart);

    app.post("/api/customer/checkout", [verifyToken, isCustomer], controller.checkout);
};