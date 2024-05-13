import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import saveInDB from "../../db/saveInDB";
import getDataFromDB from "../../db/getDataFromDB";
import { RoadDataORM } from "../../db/PostgresQL/orm";
const hashedSessionID = {};
const test = (req, res) => {
  res.json("test Done");
};
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
  console.log("inputData-> ", req.body);

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

  console.log("sessionID ", sessionId);

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
const getAllPotholes = async (req, res) => {
  try {
    const dbObj = new RoadDataORM();
    const result = await dbObj.getAllPotholes();
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error processing data:---> ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const result = {
  coordinates: [
    { lat: 26.86247, lng: 75.81016, label: 1 },
    { lat: 26.86271, lng: 75.81017, label: 1 },
    { lat: 26.86271, lng: 75.81017, label: 1 },
    { lat: 26.863, lng: 75.8088, label: 1 },
    { lat: 26.863, lng: 75.8088, label: 1 },
    { lat: 26.86314, lng: 75.80888, label: 1 },
    { lat: 26.86328, lng: 75.80892, label: 1 },
    { lat: 26.86339, lng: 75.80894, label: 1 },
    { lat: 26.8635, lng: 75.80895, label: 0 },
    { lat: 26.86362, lng: 75.80893, label: 0 },
    { lat: 26.86374, lng: 75.8089, label: 0 },
    { lat: 26.86393, lng: 75.80878, label: 0 },
    { lat: 26.86407, lng: 75.8087, label: 0 },
    { lat: 26.86417, lng: 75.80868, label: 0 },
    { lat: 26.86428, lng: 75.80869, label: 0 },
    { lat: 26.86448, lng: 75.8087, label: 0 },
    { lat: 26.86496, lng: 75.80885, label: 0 },
    { lat: 26.86496, lng: 75.80885, label: 0 },
    { lat: 26.86505, lng: 75.80848, label: 2 },
    { lat: 26.86518, lng: 75.80776, label: 2 },
    { lat: 26.8652, lng: 75.80768, label: 2 },
    { lat: 26.8652, lng: 75.80768, label: 2 },
    { lat: 26.86458, lng: 75.80755, label: 2 },
    { lat: 26.86402, lng: 75.8074, label: 2 },
    { lat: 26.86353, lng: 75.80728, label: 2 },
    { lat: 26.86196, lng: 75.80687, label: 2 },
    { lat: 26.86184, lng: 75.80683, label: 2 },
    { lat: 26.8617, lng: 75.80673, label: 0 },
    { lat: 26.86156, lng: 75.80659, label: 0 },
    { lat: 26.86156, lng: 75.80659, label: 0 },
    { lat: 26.8613, lng: 75.80654, label: 0 },
    { lat: 26.8613, lng: 75.80654, label: 0 },
    { lat: 26.86104, lng: 75.80657, label: 0 },
    { lat: 26.86087, lng: 75.80661, label: 0 },
    { lat: 26.86061, lng: 75.80662, label: 0 },
    { lat: 26.86046, lng: 75.8067, label: 0 },
    { lat: 26.86022, lng: 75.80694, label: 0 },
    { lat: 26.86015, lng: 75.80705, label: 0 },
    { lat: 26.86015, lng: 75.80705, label: 0 },
    { lat: 26.85996, lng: 75.80757, label: 1 },
    { lat: 26.85963, lng: 75.80835, label: 1 },
    { lat: 26.8594, lng: 75.80894, label: 1 },
    { lat: 26.85936, lng: 75.80905, label: 1 },
    { lat: 26.85928, lng: 75.80925, label: 1 },
    { lat: 26.85922, lng: 75.8094, label: 1 },
    { lat: 26.8588, lng: 75.81054, label: 1 },
    { lat: 26.85803, lng: 75.81242, label: 1 },
    { lat: 26.85796, lng: 75.81265, label: 1 },
    { lat: 26.85784, lng: 75.81303, label: 1 },
    { lat: 26.85776, lng: 75.81329, label: 1 },
    { lat: 26.85751, lng: 75.81424, label: 1 },
    { lat: 26.85748, lng: 75.81436, label: 1 },
    { lat: 26.8574, lng: 75.81465, label: 0 },
    { lat: 26.85729, lng: 75.81506, label: 0 },
    { lat: 26.8572, lng: 75.81541, label: 0 },
  ],
};

const sendDataToFB = async (req, res) => {
  const { route } = req.body;
  // let route =
  //   {
  //     coordinates: [
  //       {
  //         lat: 26.86102,
  //         lng: 75.80844,
  //       },

  //     ],
  //   };

  // console.log("routes=> ",route);
  // routes have multiple routes

  try {
    // const dbObj = new RoadDataORM();
    // await dbObj.connect();
    // const result = await dbObj.getLabel(route);
    // console.log("result-> ",result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// interface LabeledCoordinate {
//   LatLng: any;
//   label: number;
// }
function extractSessionId(fileName) {
  const match = fileName.match(/accelerometer_(.+).csv/);
  return match ? match[1] : null;
}
async function mergeAndPreProcess(sessionId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mergeProcess = spawn("python", [
      "./src/pythonCodes/data_merge.py",
      sessionId,
    ]);

    mergeProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    mergeProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    mergeProcess.on("close", (code) => {
      console.log(`data_merge.py child process exited with code ${code}`);
      if (code === 0) {
        resolve();
      } else {
        reject(`data_merge.py exited with non-zero exit code: ${code}`);
      }
    });
  });
}

async function predictUsingSVM(sessionId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [
      "./src/pythonCodes/svm_model.py",
      sessionId,
    ]);

    pythonProcess.stdout.on("data", (data: any) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code: number) => {
      console.log(`svm_model.py child process exited with code ${code}`);
      if (code === 0) {
        resolve();
      } else {
        reject(`svm_model.py exited with non-zero exit code: ${code}`);
      }
    });
  });
}

const label = async (req, res) => {
  console.log("inside label");
  try {
    const tmpDataDir = "./tmp_data";
    const files = await fs.promises.readdir(tmpDataDir);
    console.log("files:", files);

    for (const file of files) {
      const sessionID = extractSessionId(file);
      // console.log(sessionID);
      if (sessionID === null) continue;
      await mergeAndPreProcess(sessionID);
      await predictUsingSVM(sessionID);

      const outputFilePath = `./tmp_data/output_${sessionID}.csv`;
      console.log("output ", outputFilePath);
      if (fs.existsSync(outputFilePath)) {
        const dbObj = new RoadDataORM();
        await dbObj.connect();
        await dbObj.insertData(outputFilePath);
      } else {
        console.log("path not exists llll ");
      }
    }
  } catch (error) {
    console.log("Error in labeling using SVM:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  res.json({ msg: "check done" });
};

const hlabel = async (req, res) => {
  console.log("here=> ");
  const { route } = req.body;
  try {
    const result = await hardLabel(route);
    res.status(200).json(result);
  } catch (error) {

  }
};
const hardLabel = async (route) => {
  console.log(route);
  let result = { coordinates: [] };
  let len=route.coordinates.length;
  for (let i = 0; i < route.coordinates.length; i++) {
    const { lat, lng } = route.coordinates[i];
    if (i < 0.07*len) {
      result.coordinates.push({ lat, lng, label: 0 });
    } else if ((i >= 0.07*len && i <= 0.19*len) || (i>=0.65*len && i<=0.76*len)  ) {
      console.log("test=> ", lat,lng);
      result.coordinates.push({ lat, lng, label: 1 });
    } else {
      result.coordinates.push({ lat, lng, label: 2 });
    }
  }
  return result;
};

export { getDataFromSensor, sendDataToFB, label, test, getAllPotholes, hlabel };
