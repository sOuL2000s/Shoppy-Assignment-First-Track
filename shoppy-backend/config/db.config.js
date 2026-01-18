// shoppy-backend/config/db.config.js (Updated)

module.exports = {
    HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.DB_PORT || 3306,
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "password",
    DB: process.env.DB_NAME || "shoppy_db",
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            // Must be false if we provide the CA certificate manually
            rejectUnauthorized: false, 
            
            // CRITICAL: Provide the CA certificate content here
            ca: process.env.CA_CERTIFICATE, // <-- NEW LINE
        }
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
};