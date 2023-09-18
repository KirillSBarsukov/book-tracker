import { supabase } from '../utils/supabase'

const getAllBooks = async () => {
    const { data } = await supabase.from('book').select()
    return data
}

const searchBooksByTitle = async query => {
    const { data } = await supabase.from('book').select().ilike('title', `%${query}%`)
    return data
}

const getBookById = async id => {
    const { data } = await supabase.from('book').select().eq('id', id).single()
    return data
}

export { getBookById, searchBooksByTitle, getAllBooks }
