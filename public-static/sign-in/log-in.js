import {
    signInExistingUser,
    storeLocalStorage,
    navigate
} from '../ss-functions.js'

document.addEventListener('DOMContentLoaded', main)
const loginForm = document.getElementById('login-form')
const errorMessageEl = document.getElementById('error-message')


async function main() {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(loginForm)
        const result = await signInExistingUser(formData)
        console.log(result)
        if (result) {
            await storeLocalStorage(formData)
            const role = formData.get('role')
            const page = role === 'admin' ? 'admin-page' : 'default-user-page'
            console.log(page)
            const canNavigate = await navigate(page)
            if (canNavigate) {
                console.log(page)
                window.location.href = `/${page}`
            }

        } else {
            errorMessageEl.textContent = 'Incorrect Username or Password!'
        }
    })
}