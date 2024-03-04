import express, { Request, Response } from "express";
import fs from "fs";
import bodyParser from "body-parser";
import path from "path";
import * as mysql from 'mysql2/promise';

// Import your router file for handling sensor data
import handleSensorData from './routes/handleSensorDataRoute';
// import createConnection from './db/connectDB'; 
// createConnection();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));

// Use your router for handling sensor data routes
app.use("/", handleSensorData);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
