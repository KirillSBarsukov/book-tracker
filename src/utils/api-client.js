import { supabase } from './supabase'

function client(endpoint, customConfig = {}) {
    // const config = {
    //     method: 'GET',
    //     ...customConfig,
    // }
    return supabase.from('book').select().ilike('title', `%${endpoint}%`)

    // return window.fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config).then(response => response.json())
}

export { client }
