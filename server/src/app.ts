// import exp from "constants"
import { error } from "console";
import express, { Request, Response } from "express";
import fs from "fs";
import Data_preprocess from "./utils/data-preProcessing";
import { it } from "node:test";
import isFileEmpty from "./utils/isFileEmpty";
import { spawn } from "child_process";
import path from "path";

const app = express();

app.use(express.json());
const cnt = 0;



const hashedSessionID = {};

app.post("/getData", async (req: Request, res: Response) => {
  const data = req.body;
  const sessionId: string = req.body.sessionId;
  const csvFileName_accelerometer: string = `accelerometer_${sessionId}.csv`;
  const csvFileName_location: string = `location_${sessionId}.csv`;

  let csvData_accelerometer: string = ""; // Initialize empty string
  let csvData_location: string = ""; // Initialize empty string

  if (!hashedSessionID[sessionId]) {
    csvData_accelerometer = "time,z,y,x,accuracy\n"; // Add column names
    csvData_location = "time,longitude,latitude,altitude\n"; // Add column names
    hashedSessionID[sessionId] = 1; // Mark sessionId as processed
  }

  req.body.payload.forEach((item: any) => {
    if (item.name === "accelerometer") {
      const { time, values, accuracy } = item;
      const { z, y, x } = values;
      csvData_accelerometer += `${time},${x},${y},${z},${accuracy}\n`;
    }
    if (item.name === "location") {
      const { time, values } = item;
      const { altitude, longitude, latitude } = values;
      csvData_location += `${time},${longitude},${latitude},${altitude}\n`;
    }
  });

  console.log(sessionId);

  // Ensure the directory exists before writing the files
  const directory = "./tmp_data/";
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.appendFileSync(
    path.join(directory, csvFileName_accelerometer),
    csvData_accelerometer
  );
  fs.appendFileSync(
    path.join(directory, csvFileName_location),
    csvData_location
  );

  res.json("success");
});

app.get("/label/:sessionId", async (req, res) => {
  /*
 1. merge location , accelerometer
 2. preprocessing 
 3. feature extration 
 4. SVM labeling
 5. save in 
 */
  const sessionId = req.params.sessionId;

  try {
    await mergeAndPreProcess(sessionId);
    await predictUsingSVM(sessionId);
  } catch (error) {
    console.log("getting error in labeling using SVM for " + sessionId);
  }

  res.json({ msg: "check done" });
});

async function label_data(sessionId) {
  try {
    await mergeAndPreProcess(sessionId);
    // await predictUsingSVM(sessionId);
  } catch (error) {}
}
label_data('545aa51a-3ecd-4687-9409-909e7375eaa7');




async function mergeAndPreProcess(sessionId: string) {
  //  Spawn a Python process to execute the data merge script
  const mergeProcess = spawn("python", [
    "./src/pythonCodes/data_merge.py",
    sessionId,
  ]);

  // Handle the output or errors from the Python process
  mergeProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  mergeProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // Handle the Python process exit
  mergeProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    // Additional steps here if needed
  });
}
async function predictUsingSVM(sessionId: string) {
  const pythonProcess = spawn("python", [
    "./src/pythonCodes/svm_model.py",
    sessionId,
  ]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "ok !! " });
});
const port = 8000;

app.listen(port, () => {
  console.log("server is running .." + port);
});

