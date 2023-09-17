/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Button, FormGroup, Input, Spinner } from './StyledComponents'

function LoginForm({ onSubmit, buttonText }) {
    function handleSubmit(event) {
        event.preventDefault()
        const { username, password } = event.target.elements

        onSubmit({
            username: username.value,
            password: password.value,
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                '> div': {
                    margin: '10px auto',
                    width: '100%',
                    maxWidth: '300px',
                },
            }}
        >
            <FormGroup>
                <label htmlFor="username">Username</label>
                <Input id="username" />
            </FormGroup>
            <FormGroup>
                <label htmlFor="password">Password</label>
                <Input id="password" type="password" />
            </FormGroup>
            <div>
                <Button type="submit">
                    <Spinner /> {buttonText}
                </Button>
            </div>
        </form>
    )
}

export default LoginForm
