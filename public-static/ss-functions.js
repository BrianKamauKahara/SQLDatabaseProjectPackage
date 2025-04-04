export async function fetchExistingTables() {
    try {
        const response = await fetch('/tables')
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
        const fetchedCsvFilePath = await fetch(`/tables/${tableName}/attributes?attributes=${attributeStr}`)
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
