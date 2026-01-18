// shoppy-backend/utils/email.js

const nodemailer = require('nodemailer');

let transporter = null;
let isConfiguredForSend = false;

// Initialize Transporter: Checks environment variables at startup
try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        // Case 1: Config is incomplete. Fallback is instant log.
        console.warn("[OTP Fallback Mode]: Incomplete SMTP configuration. Emails will be logged instantly.");
    } else {
        // Case 2: Config looks complete. Attempt to create transporter.
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        isConfiguredForSend = true;
        console.log("Nodemailer transporter configured.");
    }
} catch (e) {
    // Case 3: Transporter creation failed (e.g., bad format). Fallback is instant log.
    console.error(`Transporter initialization failed: ${e.message}`);
}


const sendOtpEmail = async (email, otp) => {
    
    // Check 1: If configuration failed at startup (Case 1 or 3), log instantly and skip network attempt.
    if (!isConfiguredForSend || !transporter) {
        // This log will appear instantly (milliseconds)
        console.warn(`[INSTANT OTP LOG - FALLBACK] OTP for ${email}: ${otp}`);
        return true; 
    }
    
    // Check 2: If configured, attempt to send the email.
    try {
        // Note: This is where the long timeout previously occurred on Render.
        await transporter.sendMail({
            from: `"Shoppy Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Shoppy Account Verification OTP",
            html: `Your OTP for Shoppy is: <h1>${otp}</h1>. This is valid for 10 minutes.`,
        });
        console.log(`OTP email sent successfully to ${email}`);
        return true;
    } catch (error) {
        // Check 3: If sending fails at runtime (e.g., connection timeout on Render), 
        // this still waits for the network timeout (e.g., 30s) before executing.
        console.error("Error sending OTP email during execution (TIMEOUT LIKELY):", error.message);
        console.warn(`[OTP LOG - EMAIL FAILURE] OTP for ${email}: ${otp}`);
        
        // Ensure the API call doesn't return a 500 error to the client
        return true; 
    }
};

module.exports = { sendOtpEmail };