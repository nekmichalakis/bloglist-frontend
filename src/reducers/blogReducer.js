import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setMessage, setErrorMessage } from './notificationReducer'

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

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (blogObject) => {
    return async (dispatch) => {
        try {
            let returnedBlog = await blogService.create(blogObject)
            console.log('posted blog', returnedBlog)
            dispatch(appendBlog(returnedBlog))
            dispatch(setMessage(`new blog ${returnedBlog.title} created by ${returnedBlog.author}`))
        }
        catch (error) {
            dispatch(setErrorMessage(error.response.data.error))
        }
    }
}

export const voteBlog = (blogObject) => {
    return async (dispatch) => {
        try {
            let returnedBlog = await blogService.update(blogObject.id, blogObject)
            dispatch(replaceBlog(returnedBlog))
            dispatch(setMessage(`blog ${returnedBlog.title} liked`))
        }
        catch (error) {
            dispatch(setErrorMessage(error.response.data.error))
        }
    }
}

export const removeBlog = (id) => {
    return async (dispatch) => {
        try {
            await blogService.remove(id)
            dispatch(deleteBlog(id))
            dispatch(setMessage(`blog ${id} removed`))
        }
    catch (error) {
            dispatch(setErrorMessage(error.response.data.error))
        }
    }
}

export default blogSlice.reducer