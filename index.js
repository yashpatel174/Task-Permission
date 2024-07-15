import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import adminRoute from "./route/adminRoute.js";
import userRoute from "./route/userRoute.js";
import moduleRoute from "./route/moduleRoute.js"
const app = express();

// Environment configuration
dotenv.config();

// Middleware
app.use(express.json());


// Routes
// app.use("/admin", adminRoute);
app.use("/users", userRoute);
app.use("/modules", moduleRoute);


// Database connection
mongoose.connect(process.env.DB_CONNECTION).then(console.log("Database connected successfully."))


// Starting the server
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})