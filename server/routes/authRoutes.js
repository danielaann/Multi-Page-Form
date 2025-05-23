import express from 'express';
<<<<<<< HEAD
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';
=======
import { login, logout, register } from '../controller/authController.js';
>>>>>>> master

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

<<<<<<< HEAD
authRouter.post('/send-verify-otp',userAuth, sendVerifyOtp);
authRouter.post('/verify-account',userAuth, verifyEmail);
authRouter.post('/is-auth',userAuth, isAuthenticated);

authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);


=======
>>>>>>> master
export default authRouter; 
