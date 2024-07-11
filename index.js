import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './route/auth.js';
import permissionRoute from './route/permission.js';
import moduleRoute from './route/module.js';
const app = express();

// Environment configuration
dotenv.config();

// Middleware
app.use(express.json());


// Routes
app.use("/auth", authRoute);
app.use("/permissions", permissionRoute);
app.use("/module", moduleRoute);


// Database connection
mongoose.connect(process.env.DB_CONNECTION).then(console.log("Database connected successfully."))


// Starting the server
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})