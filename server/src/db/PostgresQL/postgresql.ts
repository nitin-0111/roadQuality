// import { Client,Query } from "pg";
// import * as fs from "fs";
// import { from as copyFrom } from "pg-copy-streams";
// export class RoadQualityService {
//   private client: Client;

//   constructor() {
//     this.client = new Client({
//       host: "localhost",
//       user: "postgres",
//       port: 5432,
//       password: "123456",
//       database: "postgres",
//     });
//   }

//   async connect() {
//     try {
//       await this.client.connect();
//       console.log("Connected to the database");
//     } catch (error) {
//       console.error("Error connecting to database:", error);
//       throw error;
//     }
//   }

//   async disconnect() {
//     try {
//       await this.client.end();
//       console.log("Disconnected from the database");
//     } catch (error) {
//       console.error("Error disconnecting from database:", error);
//     }
//   }

//   async installPostGISExtension() {
//     try {
//       await this.client.query("CREATE EXTENSION IF NOT EXISTS postgis;");
//       console.log("PostGIS extension installed or already exists.");
//     } catch (error) {
//       console.error("Error installing PostGIS extension:", error);
//     }
//   }

//   async createTableIfNotExists() {
//     try {
//       await this.client.query(`
//         CREATE TABLE IF NOT EXISTS road_quality (
//           id SERIAL PRIMARY KEY,
//           time TIMESTAMP,
//           road_geometry GEOMETRY(LINESTRING),
//           quality_label VARCHAR(50)
//         );
//       `);
//       console.log("Table road_quality created or already exists.");
//     } catch (error) {
//       console.error("Error creating table:", error);
//     }
//   }



 
  
  

//   async getDataFromDB(longitude: number, latitude: number, range: string = "1km") {
//     try {
//       const query = `
//         SELECT *, ST_AsText(road_geometry) AS segments
//         FROM road_quality
//         WHERE ST_DWithin(
//           road_geometry,
//           ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
//           $3::geography
//         );
//       `;
//       const result = await this.client.query(query, [longitude, latitude, range]);
//       return result.rows;
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       return [];
//     }
//   }
// }

// // Example usage:
// async function exampleUsage() {
//   const roadQualityService = new RoadQualityService();

//   try {
//     await roadQualityService.connect();

//     await roadQualityService.installPostGISExtension();
//     await roadQualityService.createTableIfNotExists();
//     await roadQualityService.insertDataIntoDB("./output.csv");

//     // const data = await roadQualityService.getDataFromDB(75.8305004, 26.8630226);
//     // console.log("Data from database:", data);
//   } catch (error) {
//     console.log("Error:", error);
//   } finally {
//     await roadQualityService.disconnect();
//   }
// }

// exampleUsage();


// class RoadDataORM{
//   const pool = new Pool({
//     host: "localhost",
//     user: "postgres",
//     port: 5432,
//     password: "123456",
//     database: "postgres",
//   });
//   asyn testConnect{
//      tyr Pool.query (show version );
//   }
// asyn connect(){
//   try {
//     await this.client.connect();
//     console.log("Connected to the database");
//   } catch (error) {
//     console.error("Error connecting to database:", error);
//     throw error;
//   }
// }
// async createTableifnotexit(){
//   CREATE TABLE roadlabeldData (
//     id SERIAL PRIMARY KEY,
//     time TIMESTAMPTZ,
//     geom GEOMETRY(LINESTRING, 4326)
// );
// }
// async disconnect(){
//   try {
//     await this.client.end();
//     console.log("Disconnected from the database");
//   } catch (error) {
//     console.error("Error disconnecting from database:", error);
//   }
// }
// async insertData(filepath:string){
//   const csvData = fs.readFileSync(filepath, 'utf-8')
//   const rows = csvData.split('\n').slice(1);
// try{
//   for (const row of rows) {
 
//       const [time, longitude_s, latitude_s, longitude_e, latitude_e, quality_label] = row.split(',');
//       await client.query('BEGIN');
//       await client.query(
//           'INSERT INTO segments (time, geom) VALUES ($1, ST_SetSRID(ST_MakeLine(ST_MakePoint($2, $3), ST_MakePoint($4, $5)), 4326))',
//           [time, coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1]]
//       );
//       await client.query('COMMIT');
//     }catch (e) {
//       await client.query('ROLLBACK');
//       throw e;
//       finally {
//         client.release();
//     }


// }
// async getDatalongitude: number, latitude: number, radius: number){
//   try {
//     const result = await client.query(
//         `SELECT time, ST_X(ST_StartPoint(geom)) as longitude_s, ST_Y(ST_StartPoint(geom)) as latitude_s, 
//         ST_X(ST_EndPoint(geom)) as longitude_e, ST_Y(ST_EndPoint(geom)) as latitude_e, 'quality_label' as quality_label
//         FROM segments 
//         WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)`,
//         [longitude, latitude, radius]
//     );
//     return result.rows;
// } finally {
//     client.release();
// }
// }

// };

// // Example usage:
// async function exampleUsage() {

//   const roaddataORMinstance =new RoadDataORM();
//   try{
//     roaddataORMinstance.connect()
//     await roaddataORMinstance.createTableifnotexit
//     await roaddataORMinstance.insertData
//     await roaddataORMinstance.getDate


//   }


// }







