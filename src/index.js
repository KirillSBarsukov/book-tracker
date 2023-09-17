/** @jsx jsx */
import { jsx } from '@emotion/react'
import 'bootstrap/dist/css/bootstrap-reboot.css'
import '@reach/dialog/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AuthenticatedApp } from './components/authenticated-app'
import { UnauthenticatedApp } from './components/unauthenticated-app'
import { supabase } from './utils/supabase'

async function getUser() {
    let user = null
    const { data } = await supabase.auth.getUser()
    if (data) {
        // const data = await client('me', { token })
        user = data.user
    }

    return user
}

function App() {
    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        getUser().then(u => setUser(u))
    }, [])
    const login = async ({ email, password }) => {
        const { data } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        setUser(data.user)
    }

    const register = async ({ email, password }) => {
        const { data } = await supabase.auth.signUp({
            email,
            password,
        })
        setUser(data.user)
    }
    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    return user ? (
        <AuthenticatedApp user={user} logout={logout} />
    ) : (
        <UnauthenticatedApp login={login} register={register} />
    )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
export { root }
