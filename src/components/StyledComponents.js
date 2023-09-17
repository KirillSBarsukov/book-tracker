import React from 'react'
import styled from '@emotion/styled/macro'
import { Dialog as ReachDialog } from '@reach/dialog'
import { indigo, base, text, gray, gray10, danger } from '../styles/colors'
import { small } from '../styles/media-queries'
import { FaSpinner } from 'react-icons/fa'
import { keyframes } from '@emotion/core'

const spin = keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
})
const Spinner = styled(FaSpinner)({
    animation: `${spin} 1s linear infinite`,
})

Spinner.defaultProps = {
    'aria-label': 'loading',
}
const Button = styled.button(
    {
        padding: '10px 15px',
        border: '0',
        lineHeight: '1',
        borderRadius: '3px',
    },
    ({ variant = 'primary' }) => {
        const variantsMap = {
            primary: {
                background: indigo,
                color: base,
            },
            secondary: { background: gray, color: text },
        }
        return variantsMap[variant]
    },
)

const Input = styled.input({
    borderRadius: '3px',
    border: `1px solid ${gray10}`,
    background: gray,
    padding: '8px 12px',
})

const CircleButton = styled.button({
    borderRadius: '30px',
    padding: '0',
    width: '40px',
    height: '40px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: base,
    color: text,
    border: `1px solid ${gray10}`,
    cursor: 'pointer',
})

const Dialog = styled(ReachDialog)({
    maxWidth: '450px',
    borderRadius: '3px',
    paddingBottom: '3.5em',
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
    margin: '20vh auto',
    [small]: {
        width: '100%',
        margin: '10vh auto',
    },
})

const FormGroup = styled.div({
    display: 'flex',
    flexDirection: 'column',
})

const BookListUL = styled.div({
    display: 'flex',
    flexDirection: 'column',
})
const errorMessageVariants = {
    stacked: { display: 'block' },
    inline: { display: 'inline-block' },
}

function ErrorMessage({ error, variant = 'stacked', ...props }) {
    return (
        <div role="alert" css={[{ color: danger }, errorMessageVariants[variant]]} {...props}>
            <span>There was an error: </span>
            <pre css={[{ whiteSpace: 'break-spaces', margin: '0', marginBottom: -5 }, errorMessageVariants[variant]]}>
                {error.message}
            </pre>
        </div>
    )
}
export { Button, FormGroup, Input, CircleButton, Dialog, Spinner, BookListUL, ErrorMessage }
