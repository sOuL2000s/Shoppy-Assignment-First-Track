const controller = require("../controllers/product.controller");
const { verifyToken, isSeller } = require("../middleware/authJwt");
const { validateProduct } = require("../middleware/validation");

module.exports = function(app) {
    // PUBLIC Route: View all available products
    app.get("/api/products", controller.getProducts);

    // SECURE Seller Routes
    app.post(
        "/api/seller/products",
        [verifyToken, isSeller, validateProduct],
        controller.createProduct
    );

    app.put(
        "/api/seller/products/:productId",
        [verifyToken, isSeller, validateProduct],
        controller.updateStock
    );
};