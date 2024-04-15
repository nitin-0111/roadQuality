import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class RoadQualityService {
  private client: Client;

  constructor() {
    this.client = new Client({
      connectionString: process.env.DB_URL,
    });
  }

  async createTableIfNotExists() {
    try {
      await this.client.connect();
      await this.client.query(`
        CREATE TABLE IF NOT EXISTS road_quality (
          id SERIAL PRIMARY KEY,
          time TIMESTAMP,
          road_geometry GEOMETRY(LINESTRING),
          quality_label VARCHAR(50)
        );
      `);
      console.log('Table road_quality created or already exists.');
    } catch (error) {
      console.error('Error creating table:', error);
    } finally {
      await this.client.end();
    }
  }

  async insertDataIntoDB(filePath: string) {
    try {
      await this.client.connect();
      await this.client.query(`
        COPY road_quality (time, road_geometry, quality_label)
        FROM '${filePath}' DELIMITER ',' CSV HEADER;
      `);
      console.log('Data inserted into road_quality table.');
    } catch (error) {
      console.error('Error inserting data into table:', error);
    } finally {
      await this.client.end();
    }
  }

  async getDataFromDB(longitude: number, latitude: number, range: string = '1km') {
    try {
      await this.client.connect();
      const query = `
        SELECT *, ST_AsText(road_geometry) AS segments
        FROM road_quality
        WHERE ST_DWithin(
          road_geometry,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3::geography
        );
      `;
      const result = await this.client.query(query, [longitude, latitude, range]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    } finally {
      await this.client.end();
    }
  }
}

// Example usage:
const roadQualityService = new RoadQualityService();

// Create table if not exists
roadQualityService.createTableIfNotExists();

// Insert data into DB (provide file path)
roadQualityService.insertDataIntoDB('/path/to/output.csv');

// Get data from DB (provide longitude, latitude, and optional range)
const data = await roadQualityService.getDataFromDB(75.8205074, 26.8630226, '1km');
console.log(data);
