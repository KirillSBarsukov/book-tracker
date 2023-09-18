import { useQuery, useMutation, queryCache } from 'react-query'
import { setQueryDataForBook } from './books'
import { deleteListItem, getListItems, insertListItem } from '../api/list-item'

function useListItems() {
    const { data: listItems } = useQuery({
        queryKey: 'list-items',
        queryFn: () => getListItems(),
        config: {
            onSuccess(listItems) {
                for (const listItem of listItems) {
                    setQueryDataForBook(listItem.book)
                }
            },
        },
    })
    return listItems ?? []
}

function useListItem(bookId) {
    const listItems = useListItems()
    return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
    onError: (err, variables, recover) => (typeof recover === 'function' ? recover() : null),
    onSettled: () => queryCache.invalidateQueries('list-items'),
}

function useUpdateListItem(...options) {
    return useMutation(updates => insertListItem(updates), {
        onMutate(newItem) {
            const previousItems = queryCache.getQueryData('list-items')

            queryCache.setQueryData('list-items', old => {
                return old.map(item => {
                    return item.id === newItem.id ? { ...item, ...newItem } : item
                })
            })

            return () => queryCache.setQueryData('list-items', previousItems)
        },
        ...defaultMutationOptions,
        ...options,
    })
}

function useRemoveListItem(options) {
    return useMutation(({ id }) => deleteListItem(id), {
        onMutate(removedItem) {
            const previousItems = queryCache.getQueryData('list-items')

            queryCache.setQueryData('list-items', old => {
                return old.filter(item => item.id !== removedItem.id)
            })

            return () => queryCache.setQueryData('list-items', previousItems)
        },
        ...options,
        ...defaultMutationOptions,
    })
}

function useCreateListItem(options) {
    return useMutation(({ bookId }) => insertListItem({ book_id: bookId }), {
        ...defaultMutationOptions,
        ...options,
    })
}

export { useListItem, useListItems, useUpdateListItem, useRemoveListItem, useCreateListItem }
