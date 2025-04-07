const signUpForm = document.getElementById('sign-up-form')
const errorMessageEl = document.getElementById('error-message')

document.addEventListener('DOMContentLoaded', main)
import {
    signUpNewUser,
    storeLocalStorage,
    navigate
} from '../ss-functions.js'

async function  main() {
    document.addEventListener('DOMContentLoaded', main)
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(signUpForm)
        const result = await signUpNewUser(formData)
        
        if (!result.success) {
            alert(' AN ERROR OCCURED WHEN TRYING TO LOG IN! CONTACT AN ADMIN ')
        }
        if (!result.data) { // Needs polishing up
            errorMessageEl.textContent = "Username already taken!"
        } else {
            await storeLocalStorage(formData)
            await navigate('default-user-page')
        }
    })
}