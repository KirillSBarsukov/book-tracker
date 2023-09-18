import { supabase } from '../utils/supabase'

const getListItems = async () => {
    const { data } = await supabase.from('list_item').select(`
    id,
    book_id,
    note,
    finish_date,
    book (
      *
    )
  `)
    return data
}

const insertListItem = async insert => {
    const { data } = await supabase.from('list_item').upsert([insert]).select()
    return data
}

const deleteListItem = async id => {
    await supabase.from('list_item').delete().eq('id', id)
}

export { getListItems, insertListItem, deleteListItem }
