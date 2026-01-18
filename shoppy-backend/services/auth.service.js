const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { redisClient } = require('../config/redis.config');
const { sendOtpEmail } = require('../utils/email');

const User = db.user;
const OTP_TTL = 600; // 10 minutes

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerUser = async ({ email, password, role }) => {
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    const user = await User.create({ email, password: hashedPassword, role, isVerified: false });

    const otp = generateOTP();
    const redisKey = `otp:${user.email}`;

    await redisClient.set(redisKey, otp, { EX: OTP_TTL });
    await sendOtpEmail(user.email, otp);

    return user;
};

const verifyOtp = async (email, otp) => {
    const redisKey = `otp:${email}`;
    const storedOtp = await redisClient.get(redisKey);

    if (!storedOtp || storedOtp !== otp) {
        throw new Error('Invalid or expired OTP.');
    }

    const [updatedRows] = await User.update({ isVerified: true }, { where: { email } });
    if (updatedRows === 0) throw new Error('User not found.');

    await redisClient.del(redisKey);
    return { message: "Account verified successfully." };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error('User not found.');
    if (!user.isVerified) throw new Error('Account not verified. Please verify your OTP.');
    if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid Password!');

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: 86400 } // 24 hours
    );

    return { id: user.id, email: user.email, role: user.role, accessToken: token };
};

module.exports = { registerUser, verifyOtp, loginUser };