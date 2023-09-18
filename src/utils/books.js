import { useQuery, queryCache } from 'react-query'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'
import { getBookById, searchBooksByTitle } from '../api/book'

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

const getBookSearchConfig = query => ({
    queryKey: ['bookSearch', { query }],
    queryFn: () => searchBooksByTitle(query),
    config: {
        onSuccess(books) {
            for (const book of books) {
                setQueryDataForBook(book)
            }
        },
    },
})

function useBookSearch(query) {
    const result = useQuery(getBookSearchConfig(query))
    return { ...result, books: result.data ?? loadingBooks }
}

function useBook(bookId) {
    const { data } = useQuery({
        queryKey: ['book', { bookId }],
        queryFn: () => getBookById(bookId),
    })
    return data ?? loadingBook
}

async function refetchBookSearchQuery() {
    queryCache.removeQueries('bookSearch')
    await queryCache.prefetchQuery(getBookSearchConfig(''))
}

function setQueryDataForBook(book) {
    queryCache.setQueryData(['book', { bookId: book.id }], book)
}

export { useBook, useBookSearch, refetchBookSearchQuery, setQueryDataForBook }
