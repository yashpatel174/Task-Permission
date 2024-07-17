import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './route/authRoute.js';
import groupRoute from "./route/groupRoute.js"
import moduleRoute from './route/moduleRoute.js';
const app = express();

// Environment configuration
dotenv.config();

// Middleware
app.use(express.json());

// Database connection
mongoose.connect(process.env.DB_CONNECTION).then(console.log("Database connected successfully."))

// Routes
app.use('/auth', authRoute);
app.use('/group', groupRoute);
app.use('/modules', moduleRoute);


// Starting the server
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})