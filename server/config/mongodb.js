import moongoose from 'mongoose';

const connectDB = async () => {

    moongoose.connection.on('connected', () => { console.log('MongoDB connected') });

    await moongoose.connect(`${process.env.MONGODB_URI}`)
}

export default connectDB;