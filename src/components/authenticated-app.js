/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as React from 'react'
import { DiscoverBooksScreen } from './discover'
import { Button, ErrorMessage, FullPageErrorFallback } from './StyledComponents'
import { small } from '../styles/media-queries'
import { Routes, Route, Link as RouterLink, useMatch } from 'react-router-dom'
import { gray10, indigo, text } from '../styles/colors'
import { BookScreen } from './book'
import { NotFoundScreen } from './not-found'
import { ErrorBoundary } from 'react-error-boundary'
import { FinishedScreen } from './finished'
import { ReadingListScreen } from './reading-list'

function ErrorFallback({ error }) {
    return (
        <ErrorMessage
            error={error}
            css={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        />
    )
}

function AuthenticatedApp({ user, logout }) {
    return (
        <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
            <div
                css={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                }}
            >
                {user.email}
                <Button variant="secondary" css={{ marginLeft: '10px' }} onClick={logout}>
                    Logout
                </Button>
            </div>
            <div
                css={{
                    margin: '0 auto',
                    padding: '4em 2em',
                    maxWidth: '840px',
                    width: '100%',
                    display: 'grid',
                    gridGap: '1em',
                    gridTemplateColumns: '1fr 3fr',
                    [small]: {
                        gridTemplateColumns: '1fr',
                        gridTemplateRows: 'auto',
                        width: '100%',
                    },
                }}
            >
                <div css={{ position: 'relative' }}>
                    <Nav />
                </div>
                <main css={{ width: '100%' }}>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <AppRoutes user={user} />
                    </ErrorBoundary>
                </main>
            </div>
        </ErrorBoundary>
    )
}

function NavLink(props) {
    const match = useMatch(props.to)
    return (
        <RouterLink
            css={[
                {
                    display: 'block',
                    padding: '8px 15px 8px 10px',
                    margin: '5px 0',
                    width: '100%',
                    height: '100%',
                    color: text,
                    borderRadius: '2px',
                    borderLeft: '5px solid transparent',
                    ':hover,:focus': {
                        color: indigo,
                        textDecoration: 'none',
                        background: gray10,
                    },
                },
                match
                    ? {
                          borderLeft: `5px solid ${indigo}`,
                          background: gray10,
                          ':hover,:focus': {
                              background: gray10,
                          },
                      }
                    : null,
            ]}
            {...props}
        />
    )
}

function Nav() {
    return (
        <nav
            css={{
                position: 'sticky',
                top: '4px',
                padding: '1em 1.5em',
                border: `1px solid ${gray10}`,
                borderRadius: '3px',
                [small]: {
                    position: 'static',
                    top: 'auto',
                },
            }}
        >
            <ul
                css={{
                    listStyle: 'none',
                    padding: '0',
                }}
            >
                <li>
                    <NavLink to="/list">Reading List</NavLink>
                </li>
                <li>
                    <NavLink to="/finished">Finished Books</NavLink>
                </li>
                <li>
                    <NavLink to="/discover">Discover</NavLink>
                </li>
            </ul>
        </nav>
    )
}

function AppRoutes({ user }) {
    return (
        <Routes>
            <Route path="/list" element={<ReadingListScreen user={user} />} />
            <Route path="/finished" element={<FinishedScreen user={user} />} />
            <Route path="/discover" element={<DiscoverBooksScreen user={user} />} />
            <Route path="/book/:bookId" element={<BookScreen user={user} />} />
            <Route path="*" element={<NotFoundScreen />} />
        </Routes>
    )
}

export { AuthenticatedApp }
