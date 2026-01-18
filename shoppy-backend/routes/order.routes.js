const controller = require("../controllers/order.controller");
const { verifyToken, isCustomer } = require("../middleware/authJwt");

module.exports = function(app) {
    // Requires Customer role
    app.get("/api/customer/orders", [verifyToken, isCustomer], controller.getCustomerOrders);
};