import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Toggleable from './components/Toggleable'
import Notification from './components/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { setMessage, setErrorMessage } from './reducers/notificationReducer'
import { initializeBlogs, createBlog } from './reducers/blogReducer'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const [user, setUser] = useState(null)

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes) //try to put it in useSelector ?

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    dispatch(initializeBlogs())
  }, [])

  const handleLogout = () => {
    dispatch(setMessage(`${user.username} logged out`))
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const inputBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  return (
    <div>
      <h2>{user ? 'blogs' : 'log in'}</h2>
      <Notification />
      {!user && <LoginForm setUser={setUser} />}
      {user && 
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Toggleable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm inputBlog={inputBlog} />
          </Toggleable>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} user={user} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App