import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app'
import { ReactQueryConfigProvider } from 'react-query'

const root = createRoot(document.getElementById('root'))

const queryConfig = {
    queries: {
        useErrorBoundary: true,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
            if (error.status === 404) return false
            else return failureCount < 2
        },
    },
}

root.render(
    <ReactQueryConfigProvider config={queryConfig}>
        <App />
    </ReactQueryConfigProvider>,
)
export { root }
