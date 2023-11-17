import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { voteBlog, removeBlog } from '../reducers/blogReducer'

const Blog = ({ user, blog }) => {
  const [visible, setVisible] = useState(false)

  const dispatch = useDispatch()

  const clickLike = () => {
    const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    dispatch(voteBlog(likedBlog))
  }

  return (
    <div className='blog'>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <div style={{ display: visible ? '' : 'none' }} className='urlLikes'>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={clickLike}>like</button></div>
        <div>{blog.user.username}</div>
        {(user.username === blog.user.username) &&
          <button onClick={() => dispatch(removeBlog(blog.id))}>remove</button>
        }
      </div>
    </div>
  )
}

export default Blog