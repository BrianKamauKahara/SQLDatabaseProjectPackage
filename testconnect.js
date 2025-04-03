const sql = require("mssql");

const config = {
    user: "my_user2",  // SQL Server username
    password: "PASSORD",   // SQL Server password
    server: "localhost", // e.g., "localhost" or "your-db-server"
    database: "WORKING_DATABASE",
    port: 1433,  // Default SQL Server port
    options: {
        encrypt: false,  // Set to true if using Azure
        trustServerCertificate: true  // Bypass SSL certificate issues (use with caution)
    },
    authentication: {
        type: "default"  // Uses SQL Server Authentication
    },
};

async function connectDB() {
    try {
        let pool = await sql.connect(config);
        console.log("Connected to SQL Server");
    } catch (err) {
        console.error("Connection Error: ", err);
    } finally {
        await sql.close()
    }
}

connectDB();
