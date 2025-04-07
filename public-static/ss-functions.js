export async function fetchExistingTables() {
    try {
        const response = await fetch('/db/tables', {
            method: 'GET',
            credentials: 'include'
        })
        const tableData = await response.json()
        return tableData
    }
    catch (error) {
        console.log(error)
        return null
    }
}

export async function getTableAttributes(tableData, selectedTable) {
    const foundTable = tableData.find((table) => table.tableName === selectedTable)
    return foundTable.attributes
}

export async function fetchAndSaveTableData(tableName, attributeStr) {
    try {
        if(!attributeStr) {
            return null
        }
        const fetchedCsvFilePath = await fetch(`/db/tables/${tableName}/attributes?attributes=${attributeStr}`, {
            method: 'GET',
            credentials: 'include'
        })
        const { csvFilePath } = await fetchedCsvFilePath.json()
        return csvFilePath
    } catch (error) {
        throw error
    }
}

export function getTableEls(tableData) {
    return tableData.map(table => {
        return `<option class='option' value='${table.tableName}'>${table.tableName}</option>`
    }).join('')
}

export function getAttributeEls(attributes) {
    return attributes.map(attribute =>
        `
    <label>
        <input type='checkbox' name='attribute' class='option' value='${attribute}'>${attribute}</input>
    </label>
`
    ).join('')
}

export async function signUpNewUser(formData) {
    const associationName = formData.get('association-name')
    const location = formData.get('location')
    const population = formData.get('population')
    const chairperson = formData.get('chairperson')
    const password = formData.get('password')
    const admin = formData.get('admin')
    const response = await fetch('/auth/sign-up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            associationName,
            location,
            population,
            chairperson,
            password,
            admin
        })
    })

    const result = await response.json()
    
    return result
}

export async function signInExistingUser(formData) {
    const associationName = formData.get('association-name')
    const password = formData.get('password')
    const role = formData.get('role')
    const response = await fetch('/auth/sign-in', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            associationName,
            password,
            role
        })
    })

    const result = await response.json()
    console.log(result.data)
    if (!result.success) {
        alert(' AN ERROR OCCURED WHEN TRYING TO LOG IN! CONTACT AN ADMIN ')
        console.log(result.data)
        throw result.data.error
    } 

    if (result.data.loggedIn) {
        return true
    } else {
        return false
    }
}

export async function navigate(page) {
    const res = await fetch(`/${page}`)
    if (res.ok) {
        return true
    }
    return false
}
export async function storeLocalStorage(heeh) {
    return 0;
}