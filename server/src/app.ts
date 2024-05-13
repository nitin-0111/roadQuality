import express, { Request, Response } from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import path from "path";
import morgan from 'morgan';



import handleSensorData from './routes/handleSensorDataRoute';

const app = express();
app.use(morgan('tiny'));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));

app.use("/", handleSensorData);



const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
