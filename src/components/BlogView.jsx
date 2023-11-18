import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { voteBlog, removeBlog } from '../reducers/blogReducer'

const BlogView = () => {
    const id = useParams().id
    const blog = useSelector(state => state.blogs.find(b => b.id === id))
    const user = useSelector(state => state.user.currentUser)

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
        </div>
    )
}

export default BlogView