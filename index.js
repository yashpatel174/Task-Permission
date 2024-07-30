import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoute from "./route/uesrRoute.js";
import groupRoute from "./route/groupRoute.js";
import moduleRoute from "./route/moduleRoute.js";
import dataRoute from "./route/dataRoute.js";
const app = express();

// Environment configuration
dotenv.config();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(console.log("Database connected successfully."));

// Routes
app.use("/users", userRoute);
app.use("/groups", groupRoute);
app.use("/modules", moduleRoute);
app.use("/database", dataRoute);

// Starting the server
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
