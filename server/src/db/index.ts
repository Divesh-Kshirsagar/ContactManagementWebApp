import mongoose from "mongoose";

console.log("Connection String:", process.env.MONGODB_URI);

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env file");
        }
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected! Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Connection Failed!", error);
        process.exit(1);
    }
};

export default connectDB;


