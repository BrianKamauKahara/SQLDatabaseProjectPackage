const { poolPromise, sql } = require('./db/db.js')

async function getTables () {
    // Establish a connection with the database
    const pool = await poolPromise

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
            t.is_ms_shipped = 0;
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

module.exports = { getTables }