import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        appendBlog(state, action) {
            return [...state, action.payload]
        },
        deleteBlog(state, action) {
            return state.filter(b => b.id !== action.payload)
        },
        replaceBlog(state, action) {
            return state.map(b => (b.id !== action.payload.id) ? b : action.payload)
        }
    }
})

export const { setBlogs, appendBlog, deleteBlog, replaceBlog } = blogSlice.actions

export default blogSlice.reducer