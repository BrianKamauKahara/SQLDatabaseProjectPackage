const { writeFileSync } = require('fs')
const { resolve } = require('path')
const sql = require('mssql')


// CONNECTION POOL
async function connectToDB(dbConfig) {
    return new sql.ConnectionPool(dbConfig)
    .connect()
    .then((pool) => {
        console.log("Connected to Database")
        return pool
    })
    .catch((error) => {
        console.error("DATABASE CONNECTION FAILED!", error)
    })
}

async function getTables (dbConfig) {
    // Establish a connection with the database
    const pool = await connectToDB(dbConfig)

    // Fetch all tables and their attributes
    const result = await pool.request().query(`
        SELECT 
            t.name AS table_name,
            a.name AS attribute_name
        FROM 
            sys.tables AS t
        JOIN
            sys.columns AS a ON t.object_id = a.object_id
        WHERE
            t.is_ms_shipped = 0
        AND t.name <> 'Users';
        `)
    
    // Format the tables and attributes into the desired manner
    const tables = result.recordset.reduce((acc, row) => {
        const { table_name, attribute_name } = row
        if(!acc[table_name]) {
            acc[table_name] = []
        }
        acc[table_name].push(attribute_name)
        return acc
    }, {})

    const tableData = Object.keys(tables).map(table_name => {
        return {
            "tableName" : table_name,
            "attributes" : tables[table_name]
        }
    })

    return tableData
}

async function getDataInAndSaveTable(dbConfig, tableName, attributesString) {
    // Connect to a connection pool / instantiate a pool
    const pool = await connectToDB(dbConfig)

    // Get the specified table with the selected attributes
    const queryStr = `
            SELECT ${attributesString} FROM ${tableName};
    `
    const result = await pool.request().query(queryStr)
    
    
    const csvFilePath = await makeCsvFile(result.recordset)
    return csvFilePath
}

async function makeCsvFile(data) {
    if (data) {
        const attributesStr = Object.keys(data[0]).join(',') + '\n'
        const dataStr = data.map(record => {
            return Object.keys(record).map(key => `"${record[key]}"`).join(',')
        }).join('\n')


        const csvContent = attributesStr + dataStr
        const csvFilePath = resolve(__dirname, `./csvs/data.csv`)
        writeFileSync(csvFilePath, csvContent, 'utf-8')
        return csvFilePath
    } else {
        return null
    }
    }


module.exports = { getTables, getDataInAndSaveTable, connectToDB }
