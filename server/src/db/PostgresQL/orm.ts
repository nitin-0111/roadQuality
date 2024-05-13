import { Pool, PoolClient } from "pg";
import * as fs from "fs";

export class RoadDataORM {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: "localhost",
      user: "postgres",
      port: 5432,
      password: "123456",
      database: "postgres",
    });
  }

  async testConnect() {
    try {
      const res = await this.pool.query("SELECT version()");
      console.log(res.rows[0]);
    } catch (err) {
      console.error("Error connecting to database:", err);
      throw err;
    }
  }

  async connect() {
    try {
      await this.pool.connect();
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.pool.end();
      console.log("Disconnected from the database");
    } catch (error) {
      console.error("Error disconnecting from database:", error);
      throw error;
    }
  }

  async dropTable() {
    try {
      await this.pool.query("DROP TABLE IF EXISTS RoadData");
      console.log("Table dropped successfully");
    } catch (err) {
      console.error("Error dropping table:", err);
      throw err;
    }
  }

  async truncateTable() {
    try {
      await this.pool.query("TRUNCATE TABLE RoadData");
      console.log("Table truncated successfully");
    } catch (err) {
      console.error("Error truncating table:", err);
      throw err;
    }
  }

  async createTableIfNotExist() {
    try {
      await this.pool.query(`CREATE TABLE IF NOT EXISTS RoadData (
                id SERIAL PRIMARY KEY,
                time TIMESTAMPTZ,
                geom GEOMETRY(Point, 4326),
                label INTEGER DEFAULT 0
            )`);
      console.log("Table created or already exists");
    } catch (error) {
      console.error("Error creating table:", error);
      throw error;
    }
  }

  async removeDataRedundancy(filepath) {
    console.log("in remove reduancy->> ");
    const csvData = fs.readFileSync(filepath, "utf-8");
    // console.log("csvData",csvData);
    const rows = csvData.split("\n").slice(1);

    let data = [];
    const set = new Set();

    for (const row of rows) {
      const [
        rawTime,
        longitude_s,
        latitude_s,
        longitude_e,
        latitude_e,
        quality_label,
      ] = row.split(",");
      let time;
      let label = parseInt(quality_label) > 0 ? 1 : 0;
      try {
        time = new Date();

        if (!set.has(`${latitude_s},${longitude_s}`)) {
          data.push({
            time,
            latitude: parseFloat(latitude_s),
            longitude: parseFloat(longitude_s),
            label,
          });
          set.add(`${latitude_s},${longitude_s}`);
        }

        if (!set.has(`${latitude_e},${longitude_e}`)) {
          data.push({
            time,
            latitude: parseFloat(latitude_e),
            longitude: parseFloat(longitude_e),
            label,
          });
          set.add(`${latitude_e},${longitude_e}`);
        }
      } catch (error) {
        console.error("Error parsing time value:", error);
        continue;
      }
    }

    return data;
  }
  async getAllPotholes() {
    try {
        const q = `SELECT ST_X(geom) AS lng, ST_Y(geom) AS lat FROM RoadData WHERE label = 1;`;
        const rows = await this.pool.query(q);
        let result = [];
        for (const row of rows.rows) {
            result.push({ lat: row.lat, lng: row.lng }); // Access lat and lng from 'row', not 'rows'
        }
        return result;
    } catch (error) {
        // Handle error
        console.error('Error fetching potholes:', error);
        throw error; // Rethrow error to handle it elsewhere if needed
    }
}

  async insertData(filepath: string) {
    try {
      const Data = await this.removeDataRedundancy(filepath);
      // console.log(Data);

      const insertQuery = `INSERT INTO RoadData (time, geom, label) VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)`;

      const insertValues = Data.map((data) => [
        data.time,
        data.latitude,
        data.longitude,
        data.label || 0,
      ]);
      await this.pool.query("BEGIN");

      await Promise.all(
        insertValues.map(async (values) => {
          await this.pool.query(insertQuery, values);
        })
      );

      await this.pool.query("COMMIT");
      console.log("Data inserted successfully");
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  }

  async directInsertData(Data) {
    try {
      const insertQuery = `INSERT INTO RoadData (time, geom, label) VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)`;

      const insertValues = Data.map((data) => [
        data.time,
        data.latitude,
        data.longitude,
        data.label || 0,
      ]);
      await this.pool.query("BEGIN");

      await Promise.all(
        insertValues.map(async (values) => {
          await this.pool.query(insertQuery, values);
        })
      );

      await this.pool.query("COMMIT");
      console.log("Data inserted successfully");
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  }
//   async fillResult(tableResult) {
//     let result = [];
//     // let cont = 0;
//     for (let row of tableResult.rows) {
//       let { routeIndex, coordinateIndex, lat, lng, time, label } = row;
//       // if (cont < 50) console.log("row", row);
//       // else break;
//       // cont++;
//       //  console.log("fill ing  ",routeIndex,coordinateIndex,lat,lng,time,label);

//       if (typeof routeIndex === "string") {
//         routeIndex = parseInt(routeIndex);
//         coordinateIndex = parseInt(coordinateIndex);
//       }
//       if (isNaN(routeIndex) || isNaN(coordinateIndex)) continue;

//       let coordinate = { LatLng: { lat, lng }, label: label || 2 };
//       if (!result[routeIndex])
//         result[routeIndex] = { coordinates: [], potholePointCnt: 0, time };
//       result[routeIndex].coordinates[coordinateIndex] = coordinate;
//       if (label === 1) result[routeIndex].potholePointCnt++;

//       // break;
//     }
//     return result;
//   }
//   async getLabels(routes) {
//     try {
//       await this.pool.connect();

//       const timestamp = Date.now();
//       const tempTableName = `temp_${timestamp}`;

//       await this.pool.query(`CREATE TABLE ${tempTableName} (
//             routeIndex INTEGER,
//             coordinateIndex INTEGER,
//             geom GEOMETRY(Point, 4326)
//         )`);

//       if (Array.isArray(routes)) {
//         console.log("tempTableName:", tempTableName);
//         for (let [routeIndex, route] of routes.entries()) {
//           // console.log("route:", route);
//           for (let [
//             coordinateIndex,
//             coordinate,
//           ] of route.coordinates.entries()) {
//             // console.log("coordinate:", coordinate);
//             const { lat, lng } = coordinate;
//             // console.log("lat:", lat, "lng:", lng);
//             // Insert data into the temporary table

//             const query1 = `
//   INSERT INTO ${tempTableName} (routeIndex, coordinateIndex, geom)
//   VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))
// `;
//             await this.pool.query(query1, [
//               routeIndex,
//               coordinateIndex,
//               lng,
//               lat,
//             ]);
//             // console.log(routeIndex,coordinateIndex,lng,lat);
//           }
//         }
//       }

//       // perform joint
//       const query2 = `
//         SELECT t.routeIndex, t.coordinateIndex, ST_Y(t.geom) AS lat, ST_X(t.geom) AS lng, rd.time, rd.label
//         FROM ${tempTableName} t
//         LEFT JOIN RoadData rd ON ST_DWithin(t.geom, rd.geom, 0.00496)
//         ORDER BY t.routeIndex ASC, t.coordinateIndex ASC ;
//        `;
//       const tableResult = await this.pool.query(query2);
//       // fill the result array
//       // console.log("table---> ",tableResult)

//       // let result = [];
//       // for (let row of tableResult.rows) {
//       //   let { routeIndex, coordinateIndex, lat, lng, time, label } = row;
//       //   let coordinate = { LatLng: { lat, lng }, label: label || 2 };
//       //   if (!result[routeIndex])
//       //     result[routeIndex] = { coordinates: [], potholePointCnt: 0, time };
//       //   result[routeIndex].coordinates[coordinateIndex] = coordinate;
//       //   if (label === 1) result[routeIndex].potholePointCnt++;
//       // }

//       await this.pool.query(`DROP TABLE IF EXISTS ${tempTableName}`);
//       // for (let route of result) route.score = route.potholePointCnt;
//       const result = await this.fillResult(tableResult);
//       result.sort((a, b) => b.score - a.score);
//       console.log(result);
//       return result;
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

  async getLabel(route) {
    try {
      const result = {
        coordinates: [],
        potholes: [],
        potholeCnt: 0,
      };

      for (let { lat, lng } of route.coordinates) {
        const query1 = `SELECT label, ST_X(geom) AS longitude, ST_Y(geom) AS latitude, time
        FROM RoadData
        WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1,$2), 4326)::geography, 20) order by label desc;            
        `;

        const { rows } = await this.pool.query(query1, [
         lng,lat
        ]);

        // console.log("coor", lat, lng);
        let label, time;
        if (rows.length > 0) {
          console.log("rows=> ",rows[0]);
          label = rows[0].label;
          time = rows[0].time;
        } else {
          label = 2;
          time = new Date();
        }

        result.coordinates.push({ lat, lng, label, time });

        if (label === 1) {
          result.potholes.push({ lat, lng });
        }
      }
       console.log("potholes",result)
      result.potholeCnt = result.potholes.length;
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

// Example usage:
// const roadData = new RoadDataORM();
// await roadData.createTableIfNotExist();
// await roadData.insertData('your_file_path.csv');

// // Now you can use getData method to retrieve data based on coordinates and radius.
// const data = await roadData.getData(your_longitude, your_latitude, your_radius);
// console.log(data);

// Example usage:
// async function exampleUsage() {
//   const roaddataORMinstance = new RoadDataORM();
//   try {
//     await roaddataORMinstance.connect();
//     // await roaddataORMinstance.testConnect();
//     await roaddataORMinstance.createTableIfNotExist();
//     await roaddataORMinstance.insertData(
//       "./output_173ede5d-010c-4e2c-8f2b-b68090caf70e.csv"
//     );
//     // await roaddataORMinstance.dropTable();
//     // const data = await roaddataORMinstance.getData(75.8205074, 26.8630226);
//     // console.log(data);
//     await roaddataORMinstance.disconnect();
//   } catch (error) {
//     console.error("Error in example usage:", error);
//   }
// }

// await roaddataORMinstance.createTableIfNotExist();
// await roaddataORMinstance.insertData("./output.csv");
// exampleUsage();
