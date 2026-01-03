import "./config.js";
import app from "./app.js";
import connectDB from "./db/index.js";


const port = Number(process.env.PORT) || 8001;
const host = '0.0.0.0'; // Bind to all network interfaces for Railway

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, host, () => {
            console.log(`Server started at ${host}:${port}`);
        });
    } catch (err) {
        console.log("MongoDB connection failed!", err);
        process.exit(1); // Exit process if DB fails
    }
};

startServer();

