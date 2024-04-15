"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var csvParser = require("csv-parser");
var csv_writer_1 = require("csv-writer");
// Define input and output file paths
var inputFile = '../../tmp_data/output_9abb23e9-401c-4dde-899b-28d702c6c00e.csv';
var outputFile = 'output.csv';
// Read input CSV file and process data
var data = [];
fs.createReadStream(inputFile)
    .pipe(csvParser())
    .on('data', function (row) {
    data.push(row);
})
    .on('end', function () {
    processCSVData(data);
});
// Function to process CSV data
function processCSVData(data) {
    var result = [];
    var prevRow = null;
    for (var i = 0; i < data.length; i++) {
        var curRow = data[i];
        if (!prevRow || curRow.time - prevRow.time >= 2 * 1e9 || curRow.quality_label !== prevRow.quality_label) {
            result.push(curRow);
        }
        else {
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
function writeCSVFile(data) {
    var csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
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
        .then(function () {
        console.log('CSV file has been written successfully.');
    })
        .catch(function (error) {
        console.error('Error writing CSV file:', error);
    });
}
