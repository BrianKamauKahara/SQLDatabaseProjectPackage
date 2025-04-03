const selectTableEl = document.getElementById('table-select')
const selectAttributeEl = document.getElementById('attribute-select')

document.addEventListener('DOMContentLoaded', main)

async function getTableData() {
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

async function getAttributesData(tableData, selectedTable) {
    const foundTable = tableData.find((table) => table.tableName === selectedTable)
    return foundTable.attributes
}

function getTableEls(tableData) {
        return tableData.map(table => {
            return `<option class='option' value='${table.tableName}'>${table.tableName}</option>`
        }).join('')
}

function getAttributeEls(attributes) {
    return attributes.map(attribute => 
    `
        <label>
            <input type='checkbox' class='option' value='${attribute}'>${attribute}</input>
        </label>
    `
    ).join('')
}

async function getAndDisplayTables() {
    const tableData = await getTableData()
    const tableEls = getTableEls(tableData)
    selectTableEl.innerHTML=tableEls

    return tableData
}

async function getAndDisplayAttributes (tableData) {
    const selectedTable = selectTableEl.value
    const tableAttributes = await getAttributesData(tableData, selectedTable)
    const attributeEls = getAttributeEls(tableAttributes)
    selectAttributeEl.innerHTML=attributeEls
}

async function main () {
    // Function fetches for the available tables and displays them. 
    // Also displays the rows 
    const tableData = await getAndDisplayTables() 
    await getAndDisplayAttributes(tableData)

    selectTableEl.addEventListener('change',async () => {
        await getAndDisplayAttributes(tableData)
    })
}

