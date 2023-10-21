import { useState } from "react"

const Blog = ({ user, blog, addLike, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const clickLike = () => {
    const likedBlog = {...blog, likes: blog.likes + 1, user: blog.user.id }
    addLike(likedBlog)
  }

  return (
    <div>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <div style={{ display: visible ? '' : 'none'}}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={clickLike}>like</button></div>
        <div>{blog.user.username}</div>
        {(user.username === blog.user.username) &&
          <button onClick={() => removeBlog(blog.id)}>remove</button>
        }
      </div>
    </div>  
  )
}

export default Blog