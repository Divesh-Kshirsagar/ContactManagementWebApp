import "./config.js";
import app from "./app.js";
import connectDB from "./db/index.js";


const port = process.env.PORT || 8001;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server started at port number ${port}`);
        });
    } catch (err) {
        console.log("MongoDB connection failed!", err);
        process.exit(1); // Exit process if DB fails
    }
};

startServer();

