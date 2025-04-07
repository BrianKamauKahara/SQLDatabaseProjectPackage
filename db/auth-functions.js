const adminDetails = require('./get-admin-details.js')

// Library Imports
const sql = require('mssql')
const  bcrypt  = require('bcrypt')

// Other important imports
const { connectToDB } = require('./db-functions.js')

async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

async function validatePassword(password, correct_hash) {
    return await bcrypt.compare(password, correct_hash)
}

async function addAssociationToDb(userDetails, pool) {
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
    
        /* const result = await pool.request()
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
     */
        return true
    } catch (error) {
        throw error
    }
    
}

async function storeUserInDb(userDetails, pool) {
    try {
        const password = await hashPassword(userDetails.password)
        const associationName  = userDetails.associationName

        await pool.request()
            .input('association_name', sql.VarChar, associationName )
            .input('password', sql.Text, password)
            .query(`
                INSERT INTO Users (association_name, password_hash)
                VALUES (@association_name, @password);
                `)
    } catch (error) {
        throw error
    }
}

async function signInDb(userDetails, pool) {
    try {
        const password = userDetails.password
        console.log(password)
        const associationName  = userDetails.associationName
        console.log(associationName, password)
        const result = await pool.request()
            .input('association_name', sql.VarChar, associationName )
            .input('password', sql.VarChar, password)
            .query(`
                SELECT password_hash FROM Users
                WHERE association_name =  @association_name;
                `)
        
        if (result.recordset.length) {
            return await validatePassword(password, result.recordset[0]["password_hash"])
        } else {
            return false
        }
    } catch (error) {
        throw error
    }
}

async function createNewUser(userDetails) {
    try {
        const pool = await connectToDB(adminDetails)
        const success = await addAssociationToDb(userDetails, pool)
        if (success) {
            await storeUserInDb(userDetails, pool)
        }
        return success
    } catch (error) {
        if (error.name === "RequestError") {
            return false
        } else {
            throw error
        }
    } 
}

async function signInUser(userDetails) {
    console.log('A ', userDetails)
    try {
        const pool = await connectToDB(adminDetails)
        const result = await signInDb(userDetails, pool)
    
        if (result) {
            return {
                    loggedIn: true
                } 
        } else {
            return {
                    loggedIn: false
                }
        }
    } catch (error) {
        throw error
    }
}

module.exports = { createNewUser, signInUser }
