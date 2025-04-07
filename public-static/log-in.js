import {
    signInExistingUser,
    storeLocalStorage
} from './ss-functions.js'

document.addEventListener('DOMContentLoaded', main)
const loginForm = document.getElementById('login-form')
const errorMessageEl = document.getElementById('error-message')


async function main() {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(loginForm)
        const result = await signInExistingUser(formData)
        
        if (result) {
            await storeLocalStorage(formData)
            window.location.href = './server.html'
        } else {
            errorMessageEl.textContent = 'Incorrect Username or Password!'
        }
    })
}