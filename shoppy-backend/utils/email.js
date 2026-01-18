// shoppy-backend/utils/email.js

const nodemailer = require('nodemailer');

let transporter = null;

// Initialize Transporter: Wrap in a try/catch to handle config errors upfront
try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        // Log a warning if environment variables are missing
        console.warn("[OTP Fallback Mode]: Incomplete SMTP configuration. Emails will be logged locally.");
        // If config is missing, leave transporter as null
    } else {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            // Use port 587 as default, which is common for TLS/STARTTLS
            port: process.env.EMAIL_PORT || 587, 
            secure: process.env.EMAIL_SECURE === 'true', // Use SSL/TLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        console.log("Nodemailer transporter configured.");
    }
} catch (e) {
    console.error(`Transporter initialization failed: ${e.message}`);
    transporter = null;
}


const sendOtpEmail = async (email, otp) => {
    // If transporter failed initialization, log the OTP immediately
    if (!transporter) {
        console.warn(`[OTP LOG - FALLBACK] OTP for ${email}: ${otp}`);
        // Return true so the Auth service proceeds to save the user/OTP to Redis
        return true; 
    }
    
    try {
        await transporter.sendMail({
            from: `"Shoppy Support" <${process.env.EMAIL_USER || 'no-reply@shoppy.com'}>`,
            to: email,
            subject: "Shoppy Account Verification OTP",
            html: `Your OTP for Shoppy is: <h1>${otp}</h1>. This is valid for 10 minutes.`,
        });
        console.log(`OTP email sent successfully to ${email}`);
        return true;
    } catch (error) {
        // If email fails at runtime (e.g., connection timeout in Render), log the OTP
        console.error("Error sending OTP email during execution:", error.message);
        console.warn(`[OTP LOG - EMAIL FAILURE] OTP for ${email}: ${otp}`);
        
        // CRITICAL: We must return true to prevent the server from sending a 500 error 
        // back to the client, thus allowing the user to proceed to the /verify-otp screen.
        return true; 
    }
};

module.exports = { sendOtpEmail };