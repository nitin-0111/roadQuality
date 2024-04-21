const fs = require('fs');

function checkCSVFile(filePath) {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
      if (err) {
        console.error("Error accessing file:", err);
        resolve(false); // File does not exist or is not readable
      } else {
        resolve(true); // File exists and is readable
      }
    });
  });
}

async function main() {
  try {
    const filePath = "./output.csv"; // Change this to the path of your CSV file
    const isCSVFileValid = await checkCSVFile(filePath);
    if (isCSVFileValid) {
      console.log("The CSV file is valid and readable.");
    } else {
      console.log("The CSV file does not exist or is not readable.");
    }
  } catch (error) {
    console.error("Error checking CSV file:", error);
  }
}

main();
