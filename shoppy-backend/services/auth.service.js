const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { redisClient } = require('../config/redis.config');
const { sendOtpEmail } = require('../utils/email');

const User = db.user;
const OTP_TTL = 600; // 10 minutes

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// NEW FUNCTION: Handles sending OTP to email and storing it in Redis
const sendSignupOtp = async (email) => {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email, isVerified: true } });
    if (existingUser) {
         throw new Error('User already registered and verified.');
    }
    
    // Generate and store OTP
    const otp = generateOTP();
    const redisKey = `otp:${email}`;

    // TTL is 10 minutes
    await redisClient.set(redisKey, otp, { EX: OTP_TTL });
    await sendOtpEmail(email, otp);

    return { message: "OTP sent successfully." };
};

// MODIFIED FUNCTION: Handles final registration (checks OTP, saves user)
const finalRegisterUser = async ({ email, password, role, otp }) => {
    
    // 1. Verify OTP
    const redisKey = `otp:${email}`;
    const storedOtp = await redisClient.get(redisKey);

    if (!storedOtp || storedOtp !== otp) {
        throw new Error('Invalid or expired OTP.');
    }
    
    // 2. Check if user already exists (e.g., if they started signup but abandoned it)
    let user = await User.findOne({ where: { email } });

    if (user) {
        if (user.isVerified) {
             throw new Error('User already registered and verified.');
        }
        // User exists but wasn't verified, update their details and mark as verified
        const hashedPassword = bcrypt.hashSync(password, 8);
        await User.update({ password: hashedPassword, role, isVerified: true }, { where: { email } });
        user = await User.findOne({ where: { email } }); // Fetch updated user
    } else {
        // 3. Create new user (verified immediately upon successful OTP verification)
        const hashedPassword = bcrypt.hashSync(password, 8);
        user = await User.create({ email, password: hashedPassword, role, isVerified: true });
    }

    await redisClient.del(redisKey); // Clear OTP after successful use
    return user;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error('User not found.');
    if (!user.isVerified) throw new Error('Account not verified. Please complete signup verification.');
    if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid Password!');

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: 86400 } // 24 hours
    );

    return { id: user.id, email: user.email, role: user.role, accessToken: token };
};

module.exports = { 
    sendSignupOtp, 
    registerUser: finalRegisterUser, // Exporting the new final registration function as registerUser
    loginUser 
};