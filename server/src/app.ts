// import exp from "constants"
import { error } from "console";
import express,{Request,Response} from "express";
import fs from 'fs';
import Data_preprocess from "./utils/data-preProcessing";
import { it } from "node:test";
import isFileEmpty from "./utils/isFileEmpty";
import { spawn } from "child_process";
import path from "path";
const app=express();


app.use(express.json());
const cnt=0;

function arrayToCSVRow(arr: any[]) {
    return arr.map(String).join(',') + '\n';
}

function appendToCSV(data:any){
    const csvRow=arrayToCSVRow([]);
    fs.appendFile('data.csv',csvRow,(err)=>{
         if(err)throw new error
    })
}

const hashedSessionID = {};


app.post("/getData", async (req: Request, res: Response) => {
    const data = req.body;
    const sessionId: string = req.body.sessionId;
    const csvFileName_accelerometer: string = `accelerometer_${sessionId}.csv`;
    const csvFileName_location: string = `location_${sessionId}.csv`;

    let csvData_accelerometer: string = ''; // Initialize empty string
    let csvData_location: string = ''; // Initialize empty string

    if (!hashedSessionID[sessionId]) {
        csvData_accelerometer = 'time,z,y,x,accuracy\n'; // Add column names
        csvData_location = 'time,longitude,latitude,altitude\n'; // Add column names
        hashedSessionID[sessionId] = 1; // Mark sessionId as processed
    }

    req.body.payload.forEach((item: any) => {
        if (item.name === 'accelerometer') {
            const { time, values, accuracy } = item;
            const { z, y, x } = values;
            csvData_accelerometer += `${time},${x},${y},${z},${accuracy}\n`;
        }
        if (item.name === 'location') {
            const { time, values } = item;
            const { altitude, longitude, latitude } = values;
            csvData_location += `${time},${longitude},${latitude},${altitude}\n`;
        }
    });

    console.log(sessionId);

    // Ensure the directory exists before writing the files
    const directory = './tmp_data/';
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    fs.appendFileSync(path.join(directory, csvFileName_accelerometer), csvData_accelerometer);
    fs.appendFileSync(path.join(directory, csvFileName_location), csvData_location);

    res.json("success");
});

app.get("/label/:sessionId",(req,res)=>{
/*
 1. merge location , accelerometer
 2. preprocessing 
 3. feature extration 
 4. SVM labeling
 5. save in 
 */
 const sessionId = req.params.sessionId;

 // Spawn a Python process to execute the data merge script
 const mergeProcess = spawn("python", ['./src/pythonCodes/data_merge.py', sessionId]);

 // Handle the output or errors from the Python process
 mergeProcess.stdout.on('data', (data) => {
     console.log(`stdout: ${data}`);
 });

 mergeProcess.stderr.on('data', (data) => {
     console.error(`stderr: ${data}`);
 });

 // Handle the Python process exit
 mergeProcess.on('close', (code) => {
     console.log(`child process exited with code ${code}`);
     // Additional steps here if needed
 });
 
 res.json({msg:"check done"});
})

app.get("/",(req:Request,res:Response)=>{
    res.json({msg:"ok !! "});
})
const port =8000;

app.listen(port ,()=>{
    console.log("server is running .." +port);
})


// z,y,x, lg ,l
// timestampe , log, lat ,  label,()
//           20.00001 2
//"dev": "tsc-watch --onSuccess \"nodemon dist/app.js\"",