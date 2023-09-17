/** @jsx jsx */
import { jsx } from '@emotion/react'
import 'bootstrap/dist/css/bootstrap-reboot.css'
import '@reach/dialog/styles.css'
import React from 'react'
import { AuthenticatedApp } from './components/authenticated-app'
import { UnauthenticatedApp } from './components/unauthenticated-app'
import { supabase } from './utils/supabase'
import { useAsync } from './utils/hooks'
import { FullPageSpinner } from './components/StyledComponents'
import { danger } from './styles/colors'
import { BrowserRouter } from 'react-router-dom'

async function getUser() {
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user
}

function App() {
    const { data: user, error, isLoading, isIdle, isError, isSuccess, run, setData } = useAsync()

    React.useEffect(() => {
        run(getUser())
    }, [run])

    const login = async ({ email, password }) => {
        const { data } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        setData(data.user)
    }

    const register = async ({ email, password }) => {
        const { data } = await supabase.auth.signUp({
            email,
            password,
        })
        setData(data.user)
    }
    const logout = async () => {
        await supabase.auth.signOut()
        setData(null)
    }

    if (isLoading || isIdle) {
        return <FullPageSpinner />
    }

    if (isError) {
        return (
            <div
                css={{
                    color: danger,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <p>Uh oh... There's a problem. Try refreshing the app.</p>
                <pre>{error.message}</pre>
            </div>
        )
    }

    if (isSuccess) {
        return user ? (
            <BrowserRouter>
                <AuthenticatedApp user={user} logout={logout} />
            </BrowserRouter>
        ) : (
            <UnauthenticatedApp login={login} register={register} />
        )
    }
}
export { App }
