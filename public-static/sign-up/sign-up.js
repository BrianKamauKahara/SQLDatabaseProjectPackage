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
        
        if (result.data.error) {
            alert(' AN ERROR OCCURED WHEN TRYING TO LOG IN! CONTACT AN ADMIN ')
            return
        } 
        if (!result.success) { 
            if (result.data.conflict) {
                errorMessageEl.textContent = "Username already taken!"
            } else {
                errorMessageEl.textContent = "Admin Login Wrong!"
            }
        } else {
            await storeLocalStorage(formData)
            const page = formData.get('admin') ? 'admin-page' : 'default-user-page'
            const canNavigate = await navigate(page)
            if (canNavigate) {
                window.location.href = `/${page}`
            }
        }
    })
}