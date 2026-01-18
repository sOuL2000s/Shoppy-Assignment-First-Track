const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer TOKEN'

    if (!token) {
        return res.status(403).send({ success: false, message: "No token provided!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token expired or invalid signature
            return res.status(401).send({ success: false, message: "Unauthorized! Token is invalid or expired." });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isRole = (role) => (req, res, next) => {
    if (req.userRole === role) {
        next();
    } else {
        res.status(403).send({ success: false, message: `Access Forbidden: Require ${role} Role.` });
    }
};

const authJwt = {
    verifyToken,
    isSeller: isRole('seller'),
    isCustomer: isRole('customer')
};

module.exports = authJwt;