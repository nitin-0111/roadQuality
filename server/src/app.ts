import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import path from "path";


import handleSensorData from './routes/handleSensorDataRoute';

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));

app.use("/", handleSensorData);



const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
