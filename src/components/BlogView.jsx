import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { voteBlog, removeBlog, commentBlog } from '../reducers/blogReducer'
import { useState } from 'react'

const BlogView = () => {
    const id = useParams().id
    const blog = useSelector(state => state.blogs.find(b => b.id === id))
    const user = useSelector(state => state.user.currentUser)

    const [comment, setComment] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const clickLike = () => {
        const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
        dispatch(voteBlog(likedBlog))
    }

    const clickRemove = (id) => {
        dispatch(removeBlog(id))
        navigate('/')
    }

    const handleComment = (e) => {
        e.preventDefault()
        dispatch(commentBlog(id, comment))
        setComment('')
    }

    if (!blog) {
        return null
    }

    return (
        <div>
            <h2>{blog.title}</h2>
            <div><a href='#'>{blog.url}</a></div>
            <div>likes {blog.likes} <button onClick={clickLike}>like</button></div>
            <div>Added by {blog.user.username}</div>
            {(user.username === blog.user.username) &&
                <button onClick={() => clickRemove(blog.id)}>remove</button>
            }
            <h3>comments</h3>
            <div>
                <form onSubmit={handleComment}>
                    <input
                        type="text" value={comment} name='Comment'
                        onChange={({ target }) => setComment(target.value)}
                    />
                    <button type='submit'>add comment</button>
                </form>
            </div>
            {(blog.comments) &&
                <ul>
                    {blog.comments.map((c, i) => 
                        <li key={i}>{c}</li>
                    )}
                </ul>
            }
        </div>
    )
}

export default BlogView