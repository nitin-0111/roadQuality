import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

// Define input and output file paths
const inputFile = '../../tmp_data/output_9abb23e9-401c-4dde-899b-28d702c6c00e.csv';
const outputFile = 'output.csv';

// Define type for CSV data
interface CSVRow {
  time: number;
  longitude_s: number;
  latitude_s: number;
  longitude_e: number;
  latitude_e: number;
  quality_label: number;
}

// Read input CSV file and process data
const data: CSVRow[] = [];
fs.createReadStream(inputFile)
  .pipe(csvParser())
  .on('data', (row: CSVRow) => {
    data.push(row);
  })
  .on('end', () => {
    processCSVData(data);
  });

// Function to process CSV data
function processCSVData(data: CSVRow[]) {
  const result: CSVRow[] = [];
  let prevRow: CSVRow | null = null;

  for (let i = 0; i < data.length; i++) {
    const curRow = data[i];

    if (!prevRow || curRow.time - prevRow.time >= 2*1e9 || curRow.quality_label !== prevRow.quality_label) {
      result.push(curRow);
    } else {
      prevRow.longitude_e = curRow.longitude_e;
      prevRow.latitude_e = curRow.latitude_e;
      // Update other fields if needed
    }

    prevRow = curRow;
  }

  // Write result to output CSV file
  writeCSVFile(result);
}

// Function to write data to CSV file
function writeCSVFile(data: CSVRow[]) {
  const csvWriter = createObjectCsvWriter({
    path: outputFile,
    header: [
      { id: 'time', title: 'time' },
      { id: 'longitude_s', title: 'longitude_s' },
      { id: 'latitude_s', title: 'latitude_s' },
      { id: 'longitude_e', title: 'longitude_e' },
      { id: 'latitude_e', title: 'latitude_e' },
      { id: 'quality_label', title: 'quality_label' }
    ]
  });

  csvWriter.writeRecords(data)
    .then(() => {
      console.log('CSV file has been written successfully.');
    })
    .catch((error: any) => {
      console.error('Error writing CSV file:', error);
    });
}
