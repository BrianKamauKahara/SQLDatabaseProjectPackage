import { 
    customQueryExecutor
} from '../ss-functions.js'

const customQueryForm = document.getElementById('custom-query-form')
const aiQueryForm = document.getElementById('ai-query-form')
const downloadCustomEl = document.getElementById('download-custom-btn-container') 
const downloadAiEl = document.getElementById('download-ai-btn-container') 
const customInputArea = document.getElementById('custom-query')
const AiInputArea = document.getElementById('ai-query-input')
const customStatusEl = document.getElementById('query-status-custom')
const aiStatusEl = document.getElementById('query-status-ai')
const downloadAnchor = document.getElementById('a-download')

document.addEventListener('DOMContentLoaded', main)

function toggleState(state, statusEl) {
    let color;
    let text;
    switch (state) {
        case 'fetching':
            color = 'orange'; 
            text = 'fetching'
            break;
        case 'error':
            color = 'red'; 
            text = 'error'
            break;
        case 'success':
            color = 'green'; 
            text = 'success'
            break;
        default:
            color = 'gray'; 
            break;
    }

    statusEl.style.backgroundColor = color
    statusEl.textContent = text

}

function successfulQuery(downloadEl, result, statusEl) {
    if (!result.data.csvFilePath) {
        customInputArea.textContent = "Trust Me it Worked! No output provided from the given SQL statement"
    }
    if(downloadEl.classList.contains('hidden')) {
        downloadEl.classList.remove('hidden')
    }
    const path = `/docs/csv/${encodeURIComponent(result.data.csvFilePath)}`
    console.log(path)
    downloadAnchor.href = path
    toggleState('success', statusEl)
}

function unsuccessfulQuery(inputArea, result, statusEl) {
    console.log(inputArea)
    console.log(result.data.message)
    inputArea.value = result.data.message
    toggleState('error', statusEl)
}

async function main () {
    customQueryForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        toggleState('fetching', customStatusEl)
        const formData = new FormData(customQueryForm)
        const result = await customQueryExecutor(formData)

        if (result.success) {
            successfulQuery(downloadCustomEl, result, customStatusEl)
        } else {
            unsuccessfulQuery(customInputArea, result, customStatusEl)
        }
    })
}

