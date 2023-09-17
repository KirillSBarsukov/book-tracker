/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as React from 'react'
import Tooltip from '@reach/tooltip'
import { FaSearch, FaTimes } from 'react-icons/fa'
import BookRow from './book-row'
import { client } from '../utils/api-client'
import { Input, Spinner, BookListUL } from './StyledComponents'
import { useQuery } from 'react-query'
import bookPlaceholderSvg from '../assets/book-placeholder.svg'
import { danger } from '../styles/colors'

const loadingBook = {
    title: 'Loading...',
    author: 'loading...',
    coverImageUrl: bookPlaceholderSvg,
    publisher: 'Loading Publishing',
    synopsis: 'Loading...',
    loadingBook: true,
}

const loadingBooks = Array.from({ length: 10 }, (v, index) => ({
    id: `loading-book-${index}`,
    ...loadingBook,
}))

function DiscoverBooksScreen({ user }) {
    // const [status, setStatus] = React.useState('idle')
    // const [data, setData] = React.useState(null)
    // const [query, setQuery] = React.useState('')
    // const [queried, setQueried] = React.useState(false)
    //
    // const isLoading = status === 'loading'
    // const isSuccess = status === 'success'
    //
    // React.useEffect(() => {
    //     if (!queried) {
    //         return
    //     }
    //     setStatus('loading')
    //     client(query).then(({ data }) => {
    //         setData(data)
    //         setStatus('success')
    //     })
    // }, [query, queried])

    const [query, setQuery] = React.useState('')
    const [queried, setQueried] = React.useState(false)

    const {
        data: books = loadingBooks,
        error,
        isLoading,
        isError,
        isSuccess,
    } = useQuery({
        queryKey: ['bookSearch', { query }],
        queryFn: () => client(query).then(data => data.books),
    })

    async function handleSearchSubmit(event) {
        event.preventDefault()
        setQueried(true)
        setQuery(event.target.elements.search.value)
    }

    return (
        <div>
            <form onSubmit={handleSearchSubmit}>
                <Input placeholder="Search books..." id="search" css={{ width: '100%' }} />
                <Tooltip label="Search Books">
                    <label htmlFor="search">
                        <button
                            type="submit"
                            css={{
                                border: '0',
                                position: 'relative',
                                marginLeft: '-35px',
                                background: 'transparent',
                            }}
                        >
                            {isLoading ? (
                                <Spinner />
                            ) : isError ? (
                                <FaTimes aria-label="error" css={{ color: danger }} />
                            ) : (
                                <FaSearch aria-label="search" />
                            )}
                        </button>
                    </label>
                </Tooltip>
            </form>

            {isError ? (
                <div css={{ color: danger }}>
                    <p>There was an error:</p>
                    <pre>{error.message}</pre>
                </div>
            ) : null}
            <div>
                {queried ? null : (
                    <div css={{ marginTop: 20, fontSize: '1.2em', textAlign: 'center' }}>
                        <p>Welcome to the discover page.</p>
                        <p>Here, let me load a few books for you...</p>
                        {isLoading ? (
                            <div css={{ width: '100%', margin: 'auto' }}>
                                <Spinner />
                            </div>
                        ) : isSuccess && books.length ? (
                            <p>Here you go! Find more books with the search bar above.</p>
                        ) : isSuccess && !books.length ? (
                            <p>Hmmm... I couldn't find any books to suggest for you. Sorry.</p>
                        ) : null}
                    </div>
                )}
            </div>
            {isSuccess ? (
                books.length ? (
                    <BookListUL css={{ marginTop: 20 }}>
                        {books.map(book => (
                            <li key={book.id} aria-label={book.title}>
                                <BookRow user={user} key={book.id} book={book} />
                            </li>
                        ))}
                    </BookListUL>
                ) : (
                    <p>No books found. Try another search.</p>
                )
            ) : null}
        </div>
    )
}

export { DiscoverBooksScreen }
