import { Pool, PoolClient } from 'pg';
import * as fs from 'fs';

class RoadDataORM {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: 'localhost',
            user: 'postgres',
            port: 5432,
            password: '123456',
            database: 'postgres',
        });
    }

    async testConnect() {
        try {
            const res = await this.pool.query('SELECT version()');
            console.log(res.rows[0]);
        } catch (err) {
            console.error('Error connecting to database:', err);
            throw err;
        }
    }

    async connect() {
        try {
            await this.pool.connect();
            console.log('Connected to the database');
        } catch (error) {
            console.error('Error connecting to database:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.pool.end();
            console.log('Disconnected from the database');
        } catch (error) {
            console.error('Error disconnecting from database:', error);
            throw error;
        }
    }

    async createTableIfNotExist() {
        try {
            await this.pool.query(`CREATE TABLE IF NOT EXISTS roadlabeldData (
                id SERIAL PRIMARY KEY,
                time TIMESTAMPTZ,
                geom GEOMETRY(LINESTRING, 4326)
            )`);
            console.log('Table created or already exists');
        } catch (error) {
            console.error('Error creating table:', error);
            throw error;
        }
    }

   

    async insertData(filepath: string) {
        try {
            const csvData = fs.readFileSync(filepath, 'utf-8');
            const rows = csvData.split('\n').slice(1);
            for (const row of rows) {
                const [rawTime, longitude_s, latitude_s, longitude_e, latitude_e, quality_label] = row.split(',');
                let time;
                try {
                    time = new Date(parseInt(rawTime) / 1e6); // Convert nanoseconds to milliseconds and create a Date object
                    if (isNaN(time.getTime())) {
                        throw new Error('Invalid time value');
                    }
                } catch (error) {
                    console.error('Error parsing time value:', error);
                    continue; // Skip this row and proceed with the next one
                }
                
                await this.pool.query(
                    'INSERT INTO roadlabeldData (time, geom) VALUES ($1, ST_SetSRID(ST_MakeLine(ST_MakePoint($2, $3), ST_MakePoint($4, $5)), 4326))',
                    [time, longitude_s, latitude_s, longitude_e, latitude_e]
                );
            }
            console.log('Data inserted successfully');
        } catch (error) {
            console.error('Error inserting data:', error);
            throw error;
        }
    }

    async getData(longitude: number, latitude: number, radius: number = 1000) {
        try {
            const result = await this.pool.query(
                `SELECT time, ST_X(ST_StartPoint(geom)) as longitude_s, ST_Y(ST_StartPoint(geom)) as latitude_s, 
                ST_X(ST_EndPoint(geom)) as longitude_e, ST_Y(ST_EndPoint(geom)) as latitude_e, 'quality_label' as quality_label
                FROM roadlabeldData 
                WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)`,
                [longitude, latitude, radius]
            );
            return result.rows;
        } catch (error) {
            console.error('Error getting data:', error);
            throw error;
        }
    }
}

// Example usage:
async function exampleUsage() {
    const roaddataORMinstance = new RoadDataORM();
    try {
        await roaddataORMinstance.connect();
        const data = await roaddataORMinstance.getData(75.8205074, 26.8630226); 
        console.log(data);
        await roaddataORMinstance.disconnect();
    } catch (error) {
        console.error('Error in example usage:', error);
    }
}


// await roaddataORMinstance.createTableIfNotExist();
// await roaddataORMinstance.insertData("./output.csv");
exampleUsage();
