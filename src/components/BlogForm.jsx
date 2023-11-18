import { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const BlogForm = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addBlog = (event) => {
        event.preventDefault()
        dispatch(createBlog({ title, author, url }))
        setTitle('')
        setAuthor('')
        setUrl('')
        navigate('/')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    title:
                    <input
                        type='text' value={title} name='Title' id='title-input'
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author:
                    <input
                        type='text' value={author} name='Author' id='author-input'
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    url:
                    <input
                        type='text' value={url} name='Url' id='url-input'
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type='submit' id='create-button'>create</button>
            </form>
        </div>
    )
}

export default BlogForm