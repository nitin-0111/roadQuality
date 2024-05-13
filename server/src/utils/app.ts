import * as fs from "fs";
import * as path from "path";
import { RoadDataORM } from "../db/PostgresQL/orm";

(async () => {
  const folderPath = "../CollectedDATA"; // Path to your folder
  try {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      if (file.startsWith("segment_")) {
        // Check if the file has the desired prefix
        const location = path.join(folderPath, file);
        const csvData = fs.readFileSync(location, "utf-8");
        const rows = csvData.split("\n").slice(1);
        let data = [];
        const set = new Set();
        for (const row of rows) {
          const [
            rawTime,
            longitude,
            latitude,
            quality_label,
            mean_x,
            mean_y,
            mean_z,
            RMS_x,
            RMS_y,
            RMS_z,
            longitude_s,
            latitude_s,
            longitude_e,
            latitude_e,
          ] = row.split(",");
          let time;
          let label = parseInt(quality_label) > 0 ? 1 : 0;
          try {
            time = new Date();

            if (!set.has(`${latitude_s},${longitude_s}`)) {
              // if (time && latitude !== "" && longitude !== "") {
                data.push({
                  time,
                  latitude: latitude_s,
                  longitude: longitude_s,
                  label,
                });
              // }

              set.add(`${latitude_s},${longitude_s}`);
            }

            if (!set.has(`${latitude_e},${longitude_e}`)) {
              // if (time && latitude !== "" && longitude !== "") {
                data.push({
                  time,
                  latitude: latitude_e,
                  longitude: longitude_e,
                  label,
                });
              // }
              set.add(`${latitude_e},${longitude_e}`);
            }
          } catch (error) {
            console.error("Error parsing time value:", error);
            continue;
          }
        }

        try {
          const dbObj = new RoadDataORM();
          await dbObj.connect();
          await dbObj.createTableIfNotExist();
          console.log(data.length);
          await dbObj.directInsertData(data);
        } catch (error) {
          console.log("erro->>>>>>> ");
        }

        // break;
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }
})();
