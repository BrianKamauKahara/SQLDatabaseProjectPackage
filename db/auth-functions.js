require('dotenv').config()
const { USER, PASSWORD, SERVER, DATABASE, PORT } = process.env

// Library Imports
const sql = require('mssql')
const  bcrypt  = require('bcrypt')

// Other important imports
const { connectToDB } = require('./db-functions.js')
const adminDetails = {
    user: USER,
    password: PASSWORD,
    server: SERVER,
    database: DATABASE,
    port: parseInt(PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

async function addAssociationAndGetId(userDetails, pool) {
    try {

        const { associationName, location, population, chairperson } = userDetails
        await pool.request()
            .input('location', sql.VarChar, location)
            .input('associationName', sql.VarChar, associationName)
            .input('chairperson', sql.VarChar, chairperson)
            .input('population', sql.Int, population)
            .query(`
                INSERT INTO ASSOCIATIONS (Location, Association_Name, ChairPerson, Population)
                VALUES (@location, @associationName, @chairperson, @population);
            `);
    
        const result = await pool.request()
            .input('associationName', sql.VarChar, associationName)
            .input('location', sql.VarChar, location)
            .input('chairperson', sql.VarChar, chairperson)
            .input('population', sql.Int, population)
            .query(`
                SELECT Association_ID FROM ASSOCIATIONS
                WHERE Association_Name = @associationName
                AND Location = @location
                AND ChairPerson = @chairperson
                AND Population = @population;
            `);
    
    
    
        return result.recordset
    } catch (error) {
        return {
            success: false,
            data: error
        }
    }
    
}

async function removeUser(userDetails) {
    const pool = await connectToDB(adminDetails)
    try {
        const { associationName, location, population, chairperson } = userDetails
    
        const result = await pool.request()
            .input('associationName', sql.VarChar, associationName)
            .input('location', sql.VarChar, location)
            .input('chairperson', sql.VarChar, chairperson)
            .input('population', sql.Int, population)
            .query(`
                DELETE FROM ASSOCIATIONS
                WHERE Association_Name = @associationName
                AND Location = @location
                AND ChairPerson = @chairperson
                AND Population = @population;
            `);
    } catch (error) {
        throw error
    }
}

async function createNewUser(userDetails) {
    const password = await hashPassword(userDetails.password)
    
    try {
        const pool = await connectToDB(adminDetails)
        const result = await addAssociationAndGetId(userDetails, pool)
        const associationId = result[0]["Association_ID"]
        await pool.request() // Prevent SQL injections!
            .input('association_id', sql.Int, associationId)
            .input('password_hash', sql.Text, password)
            .query(`
            INSERT INTO Users (association_id, password_hash)
            VALUES (@association_id, @password_hash);
            `)
    
        return { 
            success: true,
            data : {
                associationId: associationId 
            }
        }
    } catch (error) {
        await removeUser(userDetails)
        throw error
    } 
}

module.exports = { createNewUser }
