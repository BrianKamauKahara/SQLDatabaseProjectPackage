import { 
    customQueryExecutor,
    aiQueryExecutor
} from '../ss-functions.js'

const customQueryForm = document.getElementById('custom-query-form')
const aiQueryForm = document.getElementById('ai-query-form')
const downloadCustomEl = document.getElementById('download-custom-btn-container') 
const customInputArea = document.getElementById('custom-query')
const aiInputArea = document.getElementById('ai-query-input')
const customStatusEl = document.getElementById('query-status-custom')
const aiStatusEl = document.getElementById('query-status-ai')
const downloadAnchor = document.getElementById('a-download')
const resetBtn1 = document.getElementById('reset-btn1')
const resetBtn2 = document.getElementById('reset-btn2')

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

function successfulQuery(downloadEl=null, result, statusEl, inputArea=null) {
    if (!downloadEl) {
           inputArea.value = result.data.result[0]?.generated_text.split('[/INST]')[1]
    }
    if (!result.data.csvFilePath) {
        customInputArea.textContent = "Trust Me it Worked! No output provided from the given SQL statement"
    }
    if(downloadEl && downloadEl.classList.contains('hidden')) {
        downloadEl.classList.remove('hidden')
        const path = `/docs/csv/${encodeURIComponent(result.data.csvFilePath)}`
        console.log(path)
        downloadAnchor.href = path
    }
    toggleState('success', statusEl)
}

function unsuccessfulQuery(inputArea, result, statusEl) {
    console.log(inputArea)
    console.log(result.data.message)
    inputArea.value = result.data.message
    toggleState('error', statusEl)
}

async function main () {
    resetBtn1.addEventListener('click', () => {
        customInputArea.value = ''
    })

    resetBtn2.addEventListener('click', () => {
        aiInputArea.value = ''
    })
    
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

    aiQueryForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        toggleState('fetching', aiStatusEl)
        const formData = new FormData(aiQueryForm)
        const result = await aiQueryExecutor(formData)

        if(result.success) {
            successfulQuery(null, result, aiStatusEl, aiInputArea)
        } else {
            unsuccessfulQuery(aiInputArea, result, aiStatusEl)
        }
    })
}

