/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as React from 'react'
import { useParams } from 'react-router-dom'
import bookPlaceholderSvg from '../assets/book-placeholder.svg'
import { supabase } from '../utils/supabase'
import Tooltip from '@reach/tooltip'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { formatDate } from '../utils/misc'
import { queryCache, useMutation, useQuery } from 'react-query'
import { client } from '../utils/api-client'
import debounceFn from 'debounce-fn'
import { Textarea } from './StyledComponents'
import { StatusButtons } from './status-buttons'
import { small } from 'styles/media-queries'
import { gray80 } from '../styles/colors'
import { Rating } from './rating'

const loadingBook = {
    title: 'Loading...',
    author: 'loading...',
    coverImageUrl: bookPlaceholderSvg,
    publisher: 'Loading Publishing',
    synopsis: 'Loading...',
    loadingBook: true,
}

function BookScreen({ user }) {
    const getBookById = async id => {
        const { data } = await supabase.from('book').select().eq('id', id).single()
        return data
    }

    const getListItems = async () => {
        const { data } = await supabase.from('book').select()
        return data
    }

    const { bookId } = useParams()
    const { data: book = loadingBook } = useQuery({
        queryKey: ['book', { bookId }],
        queryFn: () => getBookById(bookId),
    })

    const { data: listItems } = useQuery({
        queryKey: 'list-items',
        queryFn: () => getListItems(),
    })
    const listItem = listItems?.find(li => li.bookId === bookId) ?? null

    const { title, author, coverImageUrl, publisher, synopsis } = book

    return (
        <div>
            <div
                css={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gridGap: '2em',
                    marginBottom: '1em',
                    [small]: {
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <img src={coverImageUrl} alt={`${title} book cover`} css={{ width: '100%', maxWidth: '14rem' }} />
                <div>
                    <div css={{ display: 'flex', position: 'relative' }}>
                        <div css={{ flex: 1, justifyContent: 'space-between' }}>
                            <h1>{title}</h1>
                            <div>
                                <i>{author}</i>
                                <span css={{ marginRight: 6, marginLeft: 6 }}>|</span>
                                <i>{publisher}</i>
                            </div>
                        </div>
                        <div
                            css={{
                                right: 0,
                                color: gray80,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                minHeight: 100,
                            }}
                        >
                            {book.loadingBook ? null : <StatusButtons user={user} book={book} />}
                        </div>
                    </div>
                    <div css={{ marginTop: 10, height: 46 }}>
                        {listItem?.finishDate ? <Rating user={user} listItem={listItem} /> : null}
                        {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
                    </div>
                    <br />
                    <p>{synopsis}</p>
                </div>
            </div>
            {!book.loadingBook && listItem ? <NotesTextarea user={user} listItem={listItem} /> : null}
        </div>
    )
}

function ListItemTimeframe({ listItem }) {
    const timeframeLabel = listItem.finishDate ? 'Start and finish date' : 'Start date'

    return (
        <Tooltip label={timeframeLabel}>
            <div aria-label={timeframeLabel} css={{ marginTop: 6 }}>
                <FaRegCalendarAlt css={{ marginTop: -2, marginRight: 5 }} />
                <span>
                    {formatDate(listItem.startDate)}{' '}
                    {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
                </span>
            </div>
        </Tooltip>
    )
}

function NotesTextarea({ listItem, user }) {
    const [mutate] = useMutation(
        updates =>
            client(`list-items/${updates.id}`, {
                method: 'PUT',
                data: updates,
                token: user.token,
            }),
        { onSettled: () => queryCache.invalidateQueries('list-items') },
    )
    const debouncedMutate = React.useMemo(() => debounceFn(mutate, { wait: 300 }), [mutate])

    function handleNotesChange(e) {
        debouncedMutate({ id: listItem.id, notes: e.target.value })
    }

    return (
        <React.Fragment>
            <div>
                <label
                    htmlFor="notes"
                    css={{
                        display: 'inline-block',
                        marginRight: 10,
                        marginTop: '0',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold',
                    }}
                >
                    Notes
                </label>
            </div>
            <Textarea
                id="notes"
                defaultValue={listItem.notes}
                onChange={handleNotesChange}
                css={{ width: '100%', minHeight: 300 }}
            />
        </React.Fragment>
    )
}

export { BookScreen }
