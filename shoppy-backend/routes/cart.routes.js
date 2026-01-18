const controller = require("../controllers/cart.controller");
const { verifyToken, isCustomer } = require("../middleware/authJwt");
const { validateCartQuantity } = require("../middleware/validation"); // <-- Updated import name

module.exports = function(app) {
    // Requires Customer role
    app.get("/api/customer/cart", [verifyToken, isCustomer], controller.getCart);
    
    // POST for incrementing/adding new item
    app.post("/api/customer/cart", [verifyToken, isCustomer, validateCartQuantity], controller.addToCart);
    
    // PUT for setting specific quantity (0 allowed for removal)
    app.put("/api/customer/cart", [verifyToken, isCustomer, validateCartQuantity], controller.updateCart);

    app.post("/api/customer/checkout", [verifyToken, isCustomer], controller.checkout);
};