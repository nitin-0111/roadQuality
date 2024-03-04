import createConnection from './connectDB'; 
import fs from 'fs';

async function saveInDB(sessionId: string) { 
    try {
        const outputSave = `./tmp_data/output_${sessionId}.csv`;
        const csvData = fs.readFileSync(outputSave, 'utf-8');
        const rows = csvData.split('\n').slice(1);
        const connection = await createConnection();

        for (const row of rows) {
            try {
                const [time, longitude_s, latitude_s, longitude_e, latitude_e, quality_label] = row.split(',');

                const query = `INSERT INTO roaddatatable (time, longitude_s, latitude_s, longitude_e, latitude_e, quality_label) VALUES (?, ?, ?, ?, ?, ?)`;
                await connection.execute(query, [time, longitude_s, latitude_s, longitude_e, latitude_e, quality_label]);
            } catch (innerError) {
                console.error('Error inserting row into MySQL:', innerError);
                console.error('Row:', row);
            }
        }

        console.log('Data inserted successfully into MySQL.');

        await connection.end();
    } catch (error) {
        console.error('Error reading or inserting data into MySQL:', error);
        throw error;
    }
}

export default saveInDB;
