require('dotenv').config()

const adminDetails = require('./get-admin-details.js')

// Library Imports
const sql = require('mssql')
const  bcrypt  = require('bcrypt')

// Other important imports
const { connectToDB } = require('./db-functions.js')

async function validateAdmins(pas) {
    return pas === process.env.PASSWORD
}

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
            
        return true
    } catch (error) {
        throw error
    }
    
}

async function storeUserInDb(userDetails, pool) {
    try {
        const password = await hashPassword(userDetails.password)
        const associationName  = userDetails.associationName
        
        if (!userDetails.admin) {
            await pool.request()
                .input('association_name', sql.VarChar, associationName )
                .input('password', sql.Text, password)
                .query(`
                    INSERT INTO Users (association_name, password_hash)
                    VALUES (@association_name, @password);
                    `)
        } else {
            await pool.request()
                .input('admin_name', sql.VarChar, associationName)
                .input('password', sql.Text, password)
                .query(`
                    INSERT INTO Admins (admin_name, password_hash)
                    VALUES (@admin_name, @password);
                    `)
        }
    } catch (error) {
        throw error
    }
}

async function signInDb(userDetails, pool) {
    try {
        const password = userDetails.password
        const name  = userDetails.associationName
        const table = userDetails.role === 'admin' ? 'Admins' : 'Users'
        const column = userDetails.role === 'admin' ? 'admin_name' : 'association_name'
        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .query(`
                SELECT password_hash FROM ${table}
                WHERE ${column} =  @name;
                `)
        
        if (result.recordset.length) {
            return await validatePassword(password, result.recordset[0]["password_hash"])
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function createNewUser(userDetails) {
    try {
        const pool = await connectToDB(adminDetails)
        let success;
        if (!userDetails.admin) {
            success = await addAssociationToDb(userDetails, pool)
        } else {
            success = await validateAdmins(userDetails.admin)
        } 

        if (success) {
            await storeUserInDb(userDetails, pool)
        }

        return {
           success,
           conflict: false
        }
    } catch (error) {
        if (error.name === "RequestError") {
            return {
                success: false,
                conflict: true
        }
        } else {
            throw error
        }
    } 
}

async function signInUser(userDetails) {
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

async function queryHuggingFace(inputText) {
    const response = await fetch('/ai', {
        method: 'POST',
        headers: {
            'ContentType' : 'application/json'
        },
        body: JSON.stringify(inputText)
    })
}

module.exports = { createNewUser, signInUser }
