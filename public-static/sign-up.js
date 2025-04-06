import {
    signUpNewUser,
    storeLocalStorage
} from './ss-functions.js'

document.addEventListener('DOMContentLoaded', main)
const signUpForm = document.getElementById('sign-up-form')

async function  main() {
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(signUpForm)
        const success = await signUpNewUser(formData)
        if (success) {
            await storeLocalStorage(formData)
            window.location.href = './server.html'
        }
    })
}