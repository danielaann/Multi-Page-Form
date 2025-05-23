import moongoose from 'mongoose';

const userSchema = new moongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyOtp: {
        type: String,
        default: '',
    },
    verifyOtpExpiresAT: {
        type: Number,
        default: 0,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: '',
    },
    resetOtpExpiresAT: {
        type: Number,
        default: 0,
    },
})

const userModel = moongoose.model('user', userSchema);
export default userModel;