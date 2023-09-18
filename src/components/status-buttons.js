/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as React from 'react'
import { FaCheckCircle, FaPlusCircle, FaMinusCircle, FaBook, FaTimesCircle } from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import { useAsync } from 'utils/hooks'
import { useCreateListItem, useListItem, useRemoveListItem, useUpdateListItem } from '../utils/list-items'
import * as colors from 'styles/colors'
import { CircleButton, Spinner } from './StyledComponents'

function TooltipButton({ label, highlight, onClick, icon, ...rest }) {
    const { isLoading, isError, error, run, reset } = useAsync()

    function handleClick() {
        if (isError) {
            reset()
        } else {
            run(onClick())
        }
    }

    return (
        <Tooltip label={isError ? error.message : label}>
            <CircleButton
                css={{
                    backgroundColor: 'white',
                    ':hover,:focus': {
                        color: isLoading ? colors.gray80 : isError ? colors.danger : highlight,
                    },
                }}
                disabled={isLoading}
                onClick={handleClick}
                aria-label={isError ? error.message : label}
                {...rest}
            >
                {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
            </CircleButton>
        </Tooltip>
    )
}

function StatusButtons({ book }) {
    const listItem = useListItem(book.id)
    const [update] = useUpdateListItem({ throwOnError: true })
    const [remove] = useRemoveListItem({ throwOnError: true })
    const [create] = useCreateListItem({ throwOnError: true })

    return (
        <React.Fragment>
            {listItem ? (
                Boolean(listItem.finish_date) ? (
                    <TooltipButton
                        label="Unmark as read"
                        highlight={colors.yellow}
                        onClick={() => update({ id: listItem.id, finish_date: null })}
                        icon={<FaBook />}
                    />
                ) : (
                    <TooltipButton
                        label="Mark as read"
                        highlight={colors.green}
                        onClick={() => update({ id: listItem.id, finish_date: new Date().toISOString() })}
                        icon={<FaCheckCircle />}
                    />
                )
            ) : null}
            {listItem ? (
                <TooltipButton
                    label="Remove from list"
                    highlight={colors.danger}
                    onClick={() => remove({ id: listItem.id })}
                    icon={<FaMinusCircle />}
                />
            ) : (
                <TooltipButton
                    label="Add to list"
                    highlight={colors.indigo}
                    onClick={() => create({ bookId: book.id })}
                    icon={<FaPlusCircle />}
                />
            )}
        </React.Fragment>
    )
}

export { StatusButtons }
