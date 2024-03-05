import mysql from 'mysql2/promise';

// Define MySQL connection configuration
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'roadData',
};

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

export default createConnection;
