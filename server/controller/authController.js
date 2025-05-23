import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';



export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }
    try {

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bycrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send a welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            text: `Hello ${name},\n\nThank you for registering with us! We are excited to have you on board.\n\nBest regards,\nThe Team`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: 'User created successfully', user });
    
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error in register,authController' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({ message: 'User logged in successfully', user });
    
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error in login,authController' });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error in logout,authController' });
    }
}

// Send OTP for email verification
export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }  

        if (user.isAccountVerified){
            return res.status(400).json({ message: 'User already verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a 6-digit OTP

        user.verifyOtp = otp;
        user.verifyOtpExpiresAT = Date.now() + 24 * 60 * 60 * 1000; // OTP valid for a day
        
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Email',
            text: `Your OTP for email verification is ${otp}. It is valid for 24 hours.`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent for email verification', userId });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error in sendVerifyOtp,authController' });
    }
} 

// Verify OTP for email verification
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }
    
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verifyOtp !== otp || user.verifyOtp === '') {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpiresAT < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiresAT = 0;

        await user.save();
        return res.status(200).json({ message: 'Email verified successfully' });
        
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error in verifyEmail,authController' });
    }
}

//Is user authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ message: 'User is authenticated', user });
        
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

//Send password reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Please enter valid Email' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a 6-digit OTP

        user.resetOtp = otp;
        user.resetOtpExpiresAT = Date.now() + 15 * 60 * 1000 // OTP valid for 15mins
        
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Your Password',
            text: `Your OTP for password reset is ${otp}. It is valid for 15 minutes. Use it to reset your password.`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent for password reset', email });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error in sendResetOtp,authController' });
    }
}

//Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.resetOtp !== otp || user.resetOtp === '') {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.resetOtpExpiresAT < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const hashedPassword = await bycrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiresAT = 0;

        await user.save();
        return res.status(200).json({ message: 'Password has been reset successfully' });
        
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error in resetPassword,authController' });
    }
}

