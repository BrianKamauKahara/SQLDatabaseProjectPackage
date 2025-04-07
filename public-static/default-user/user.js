const selectTableEl = document.getElementById('table-select')
const selectAttributeEl = document.getElementById('attribute-select')
const tableFormEl = document.getElementById('table-form')
const downloadSection = document.getElementById('download-btn-container')
const downloadAnchor = document.getElementById('a-download')

import { 
    fetchExistingTables,
    fetchAndSaveTableData, 
    getTableAttributes, 
    getTableEls, 
    getAttributeEls 
} from '../ss-functions.js'

document.addEventListener('DOMContentLoaded', main)

async function getAndDisplayTables() {
    const tableData = await fetchExistingTables()
    const tableEls = getTableEls(tableData)
    selectTableEl.innerHTML = tableEls

    return tableData
}

async function getAndDisplayAttributes(tableData) {
    const selectedTable = selectTableEl.value
    const tableAttributes = await getTableAttributes(tableData, selectedTable)
    const attributeEls = getAttributeEls(tableAttributes)
    selectAttributeEl.innerHTML = attributeEls
}

async function makeCsvDownloadable(e) {
    e.preventDefault()
    
    // Trigger fetching the csv based on the user's input
    const formData = new FormData(e.target)
    const tableSelected = formData.get('table')
    const attributesSelectedString = formData.getAll('attribute').join(', ')
    
    try {
        const csvFilePath = await fetchAndSaveTableData(tableSelected, attributesSelectedString) 
        downloadAnchor.href = `/docs/csv/${encodeURIComponent(csvFilePath)}`
        if(downloadSection.classList.contains('hidden')) {
            downloadSection.classList.remove('hidden')
        }
    } catch (error) {
        console.log(error)
        return
    }
}

async function main () {
    // Function fetches for the available tables and displays them. 
    // Also displays the rows 
    const tableData = await getAndDisplayTables() 
    console.log(tableData)
    await getAndDisplayAttributes(tableData)

    selectTableEl.addEventListener('change', async () => {
        await getAndDisplayAttributes(tableData)
    })

    tableFormEl.addEventListener('submit', async (e) => {
        await makeCsvDownloadable(e)
    })


}

