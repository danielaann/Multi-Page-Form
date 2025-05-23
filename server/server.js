import express from 'express';
import cors from 'cors';
import "dotenv/config";
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRouthes.js';
import formRouter from './routes/formRoutes.js';

const app = express(); 

const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(cookieParser());

//Api endpoints
app.get('/', (req, res) => {
    res.send('Hello World! hey');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use('/api/auth', authRouter);
app.use('/api/form', formRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});