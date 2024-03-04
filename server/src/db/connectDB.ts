import mysql from 'mysql2/promise';

// Define MySQL connection configuration
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '123@Nitin',
    database: 'roadData',
};

// Function to create MySQL connection
const createConnection = async () => {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        console.log('Connected to MySQL database.');
        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        throw error;
    }
}

// createConnection();
// Export the function to create MySQL connection
export default createConnection;
