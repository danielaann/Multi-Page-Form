import express from 'express';
import cors from 'cors';
import "dotenv/config";
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
<<<<<<< HEAD
import userRouter from './routes/userRouthes.js';
=======
>>>>>>> master


const app = express(); 

const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors({credentials: true}));
app.use(cookieParser());

//Api endpoints
app.get('/', (req, res) => {
    res.send('Hello World! hey');
});
<<<<<<< HEAD

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

=======
app.use('/api/auth', authRouter);
>>>>>>> master

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});