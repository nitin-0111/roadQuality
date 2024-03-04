import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import saveInDB from "../../db/saveInDB";
const hashedSessionID = {};
const test=(req,res)=>{
    res.json("test Done");
}
const getDataFromSensor = async (req: Request, res: Response) => {
  // const data = req.body;
  const sessionId: string = req.body.sessionId;
  const csvFileName_accelerometer: string = `accelerometer_${sessionId}.csv`;
  const csvFileName_location: string = `location_${sessionId}.csv`;

  let csvData_accelerometer: string = "";
  let csvData_location: string = "";

  if (!hashedSessionID[sessionId]) {
    csvData_accelerometer = "time_acc,z,y,x,accuracy,time_sec\n";
    csvData_location = "time_loc,longitude,latitude,altitude,time_sec\n";
    hashedSessionID[sessionId] = 1;
  }

  req.body.payload.forEach((item: any) => {
    if (item.name === "accelerometer") {
      const { time, values, accuracy } = item;
      const { z, y, x } = values;
      csvData_accelerometer += `${time},${z},${y},${x},${accuracy},${Math.floor(
        time / 1e9
      )}\n`;
    }
    if (item.name === "location") {
      const { time, values } = item;
      const { altitude, longitude, latitude } = values;
      csvData_location += `${time},${longitude},${latitude},${altitude},${Math.floor(
        time / 1e9
      )}\n`;
    }
  });

  console.log("sessionID ",sessionId);

  // Ensure the directory exists
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
};

const sendDataToFB = async (req, res) => {
  const { longitude, latitude } = req.body; // Destructure longitude and latitude from the request body

  // Now you can use longitude and latitude variables to process the data
  // For example, you can fetch data based on these coordinates, arrange it, and send it back

  try {
    // Fetch data based on longitude and latitude
    // Arrange data
    // Send back the arranged data as a response
    res
      .status(200)
      .json({ message: "Data received and processed successfully" });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const label = async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    await mergeAndPreProcess(sessionId);
    await predictUsingSVM(sessionId);
    await saveInDB(sessionId);
  } catch (error) {
    console.log("getting error in labeling using SVM for " + sessionId);
  }

  res.json({ msg: "check done" });
};



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
  try {
    const pythonProcess = spawn('python', [
      './src/pythonCodes/svm_model.py',
      sessionId,
    ]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`svm_model.py child process exited with code ${code}`);
    });

    const testProcess = spawn("python", [
      "./src/controller/getDataController/test1.py",
      sessionId,
    ]);

    testProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    testProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    testProcess.on("close", (code) => {
      console.log(`test1.py child process exited with code ${code}`);
    });
  } catch (error) {
    console.error("Error executing Python scripts:", error);
  }
}


export { getDataFromSensor, sendDataToFB ,label,test};
