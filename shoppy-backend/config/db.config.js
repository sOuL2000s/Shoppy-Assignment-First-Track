module.exports = {
    HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.DB_PORT || 3306, // <-- NEW: Use DB_PORT env var
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "password",
    DB: process.env.DB_NAME || "shoppy_db",
    dialect: "mysql",
    // CRITICAL: SSL configuration for Aiven
    dialectOptions: {
        ssl: {
            // Aiven often requires rejecting unauthorized to work correctly.
            // If you get "Self-signed certificate" errors, you may need to download and use the CA file.
            // For general public cloud connections, setting rejectUnauthorized to true is standard.
            // We'll set it to false temporarily if issues persist, but try true first.
            rejectUnauthorized: true, 
        }
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
};